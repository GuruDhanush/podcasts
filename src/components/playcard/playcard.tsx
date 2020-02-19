import { Component, h, Prop, getAssetPath, State } from '@stencil/core';
import { getReadableDay, Episode, PlayStatus, PodDB, OfflineFiles } from '../../util';
import Tunnel from '../data/audio';
import { IDBPDatabase, openDB } from 'idb';


@Component({
  tag: 'app-playcard',
  styleUrl: 'playcard.css',
  shadow: true
})
export class Playcard {

  @Prop() podcastID: string;
  @Prop() podcastThumbnail: string;
  @Prop() episodeTitle: string;
  @Prop() podcastTitle: string;
  @Prop() episodeDescription: string;
  @Prop() created: Date;
  @Prop() playUrl: string;
  @Prop() isdownloaded: boolean;
  @State() downloaded: boolean;
  @State() _cancelRequested: boolean = false;
  _reader: ReadableStreamDefaultReader;
  locked: boolean = false;
  @State() started: boolean = false;
  @State() currentLength: number = 0;
  @State() totalLength: number = 1;
  db: IDBPDatabase<PodDB>;
  localUrl: string;

  playImage = 'play_circle.svg';
  pauseImage = 'pause_circle.svg';

  async componentDidLoad() {
    this.db = await openDB<PodDB>('pod-db', 1, {});
    if (this.isdownloaded) {
      try {
        let offlineFiles = await this.db.transaction("offlineStore").store.get(this.playUrl);
        this.localUrl = URL.createObjectURL(offlineFiles.blob);
      }
      catch (e) {
        console.log("not stored")
      }
    }
  }


  togglePlayButton(episode: Episode, playStatus: PlayStatus) {
    if (episode && (episode.audio == this.playUrl || ((this.downloaded || this.isdownloaded) && episode.audio == this.localUrl))) {
      if (playStatus === PlayStatus.Play) {
        return getAssetPath(`/assets/${this.pauseImage}`);
      }
      else if (playStatus === PlayStatus.Loading) {
        return getAssetPath(`/assets/${this.pauseImage}`);
      }
      else if (playStatus === PlayStatus.Paused) {
        return getAssetPath(`/assets/${this.playImage}`);
      }
      else if (playStatus === PlayStatus.Playing) {
        return getAssetPath(`/assets/${this.pauseImage}`);
      }
    }
    return getAssetPath(`/assets/${this.playImage}`);
  }


  render() {
    return (
      <div>
        <Tunnel.Consumer>
          {({ play, episode, playStatus }) => (
            <div class="play-card">
              <div class="img-row">
                <img class="podcast-img" src={this.podcastThumbnail} ></img>
                <div class="podcast-info">
                  <div class="episode-title">{this.episodeTitle}</div>
                  <div class="podcast-tite">{this.podcastTitle}</div>
                </div>
              </div>
              <div class="description" innerHTML={this.episodeDescription}></div>
              <div class="control-row">
                <div class="play-row">
                  <button onClick={() => play({ title: this.episodeTitle, audio: this.isdownloaded || this.downloaded ? this.localUrl : this.playUrl, thumbnail: this.podcastThumbnail, description: this.episodeDescription }, this.podcastTitle)}>
                    <img src={this.togglePlayButton(episode, playStatus)} />
                  </button>

                  <button onClick={() => this.startDownload()} >
                    <img class={this.isdownloaded || this.downloaded ? 'downloaded-icon' : ''} src={getAssetPath('/assets/download.svg')} />
                  </button>

                  <span>
                  {this.started ? Math.round(100-((this.totalLength - this.currentLength)*100)/this.totalLength) + '%': ''} 
                  </span>
                </div>

                <div class="podcast-created">{'Last Updated ' + getReadableDay(this.created)}</div>
              </div>
              {/* <progress class="play-progress" max="100" value="10"   ></progress> */}
            </div>
          )}
        </Tunnel.Consumer>
      </div>
    );
  }

  readableStart = (controller) => {
    if (this._cancelRequested) {
      console.log('canceling read')
      controller.close();
      return;
    }

    this.read(controller);
  }

  progressFetch(input, init = {}) {
    const request = (input instanceof Request) ? input : new Request(input)
    this._cancelRequested = false;

    return fetch(request, init).then(response => {
      if (!response.body) {
        throw Error('ReadableStream is not yet supported in this browser.  <a href="https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream">More Info</a>')
      }

      // this occurs if cancel() was called before server responded (before fetch() Promise resolved)
      if (this._cancelRequested) {
        response.body.getReader().cancel();
        return Promise.reject('cancel requested before server responded.');
      }

      if (!response.ok) {
        // HTTP error server response
        throw Error(`Server responded ${response.status} ${response.statusText}`);
      }

      // Server must send CORS header "Access-Control-Expose-Headers: content-length" to access
      const contentLength = response.headers.get('content-length');

      if (contentLength === null) {
        // don't evaluate download progress if we can't compare against a total size
        throw Error('Content-Length server response header missing.  <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Access-Control-Expose-Headers">More Info</a>')
      }

      this.totalLength = parseInt(contentLength, 10);
      this.totalLength = this.totalLength === 0 ? 1 : this.totalLength;

      console.log("totalLength ", this.totalLength)

      this._reader = response.body.getReader()



      return new Response(
        new ReadableStream({
          start: this.readableStart
        })
      )
    });
  }

  read(controller) {
    this._reader.read().then(({ done, value }) => {
      if (done) {
        controller.close();
        return;
      }

      this.currentLength += value.byteLength;
      controller.enqueue(value);
      this.read(controller);
    }).catch(error => {
      console.error(error);
      controller.error(error)
    });
  }


  cancel() {
    console.log('download cancel requested.')
    this._cancelRequested = true;
    if (this._reader) {
      console.log('cancelling current download');
      return this._reader.cancel();
    }
    return Promise.resolve();
  }

  async updateDownloadStatus(downloadState: boolean) {
    let currentEpisode =  await this.db.transaction("episodes").store.get(this.podcastID);

    if(currentEpisode.isDownloaded != downloadState) {
      currentEpisode.isDownloaded = downloadState;
      await this.db.transaction("episodes", "readwrite").store.put(currentEpisode);
      console.log("Updated download state");
      this.downloaded = downloadState;
    }
  }

  async startDownload() {

    if (this.downloaded || this.isdownloaded) {
      try {
      await this.updateDownloadStatus(false);
       await this.db.transaction("offlineStore").store.delete(this.playUrl);
      }
      catch (e) {
        console.log("Record not deleted or its not there")
      }
      return;
    }

    let url = this.playUrl;
    // Ensure "promise-safe" (aka "thread-safe" JavaScript).
    // Caused by slow server response or consequetive calls to startDownload() before stopDownload() Promise resolves
    if (this.locked) {
      console.error('startDownload() failed. Previous download not yet initialized');
      return;
    }

    this.locked = true;
    await this.stopDownload();
    this.locked = false;
    this.started = true;
    console.log('Starting download...');
    this.progressFetch('https://cors.x7.workers.dev/' + url)
      .then(response => response.blob())
      .then(blob => this.downloadDone(blob))
      .catch(error => this.showError(error))
  }

  stopDownload() {
    // stop previous download
    // if (this.currentLength > 0) {
    //   return progressFetcher.cancel()
    // } else {
    // no previous download to cancel
    return Promise.resolve();
    //}
  }

  async downloadDone(blob) {
    this.localUrl = URL.createObjectURL(blob);
    let offlineFile : OfflineFiles = { url: this.playUrl, blob: blob };
    await this.db.transaction("offlineStore", 'readwrite').store.put(offlineFile)
    await this.updateDownloadStatus(true);
    this.started  = false;
    console.log("downloaded " + this.localUrl);
  }

  showError(error) {
    console.error(error);
  }


}




