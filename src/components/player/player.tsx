import { Component, h, State } from '@stencil/core';
import Tunnel from '../data/audio';
import { Episode, PlayStatus, Podcast1, PodDB, secureUrl } from '../../util';
import { setAudioMetadata } from '../../metadata-utils';
//import { openDB } from 'idb/with-async-ittr';
import { openDB, IDBPDatabase } from 'idb';




@Component({
  tag: 'podcast-player',
  shadow: true
})

export class Player {

  @State() _episode: Episode = { audio: null };
  @State() _playStatus: PlayStatus = null;
  audio: HTMLAudioElement = new Audio();

  db: IDBPDatabase<PodDB>;
  namespace = 'http://www.itunes.com/dtds/podcast-1.0.dtd';

  podcasts = [
    'https://feeds.megaphone.fm/the-daily-show',
    'https://rss.art19.com/the-daily',
    'https://softwareengineeringdaily.com/feed/podcast/',
    'https://rustacean-station.org/podcast.rss',
    'https://video-api.wsj.com/podcast/rss/wsj/whats-news',
    'https://podcast.posttv.com/',
  ]

  play = (episode: Episode, podcastTitle: string) => {
    this._episode = episode;

    if (this.audio.src != episode.audio) {
      this.audio.pause();
      this.audio.src = episode.audio;
      this.audio.load();
    }

    if (this.audio.paused || this.audio.seeking) {
      this.audio.play()
        .then(_ => setAudioMetadata(this.audio, episode, podcastTitle))
        .catch(err => console.log('audio metadata error ' + err))
    }
    else {
      this.audio.pause();
    }
  }

  async componentWillLoad() {
    this.audio.addEventListener('play', this.playStartEventHandler.bind(this));
    this.audio.addEventListener('playing', this.playStartEventHandler.bind(this));
    this.audio.addEventListener('pause', this.pauseEventHandler.bind(this));
    this.audio.addEventListener('end', this.PlayCompletedEventHandler.bind(this));
    this.audio.addEventListener('waiting', this.waitingEventHandler.bind(this));

    this.db = await openDB<PodDB>('pod-db', 1, {
      upgrade(db: IDBPDatabase<PodDB>) {
        const podcasts = db.createObjectStore('podcasts', {
          keyPath: 'ID'
        });
        podcasts.createIndex('pubDate', 'pubDate');

        const episodes = db.createObjectStore('episodes', {
          keyPath: 'ID'
        });
        episodes.createIndex('pubDate', 'pubDate');
        episodes.createIndex('podcastID', 'podcastID');

        db.createObjectStore('offlineStore', {
          keyPath: 'url'
        });
      }
    });
    try {
      await this.loadRecords();
    }
    catch(e) {
      console.log("offline");
    }
  }

  async loadRecords() {

    for (const i in this.podcasts) {
      let res = new DOMParser()
      .parseFromString(await (await fetch('https://cors.x7.workers.dev/'+ this.podcasts[i])).text(), 'application/xml');

      //console.log(res);
      await this.loadChannel(res, this.podcasts[i]);
    }
  }

  async loadChannel(channel: Document, podcasturl: string) {

    let itunesThumbnail = channel.getElementsByTagNameNS(this.namespace,"image")[0]?.textContent;

    let podcast: Podcast1 = {
      ID: secureUrl(podcasturl),
      publisher: channel.getElementsByTagNameNS(this.namespace, "author")[0]?.textContent,
      title: channel.querySelector("title")?.textContent,
      description: channel.querySelector("description")?.textContent,
      url: secureUrl(channel.querySelector("link")?.textContent),
      thumbnail: itunesThumbnail != null ? itunesThumbnail : secureUrl(channel.querySelector("image url")?.textContent)
    }

    if(!await this.db.getKey("podcasts", podcast.ID)) {
      this.db.put("podcasts", podcast);
    }

    await this.loadEpisodes(channel, podcast);
  }

  async loadEpisodes(episodes: Document, podcast: Podcast1) {

    let maxPubDate = null;
    try {
      let maxdateCursor = await this.db.transaction("episodes").store.index("pubDate").openCursor(null, "prev");
      while(maxdateCursor) {
        if(maxdateCursor.value.podcastID == podcast.ID) {
          maxPubDate = maxdateCursor.value.pubDate;
          break;
        }
        maxdateCursor = await maxdateCursor.continue();
      }
      //maxPubDate = (await this.db.transaction("episodes").store.index("pubDate").openCursor(null, "prev")).value.pubDate;
    }
    catch {
      console.log("Empty DB");
    }

    const listepisodes = episodes.querySelectorAll("item");
    for(let i = 0; i < listepisodes.length; i++) {
      let episode = listepisodes[i];
      let guid = episode.querySelector("guid").textContent;
      let epsiodeDate = new Date(episode.querySelector("pubDate").textContent);

      if(+epsiodeDate <= +maxPubDate) {
        return;
      }

      if(!await this.db.getKeyFromIndex("episodes", "podcastID", guid)) {
        let enclosure = episode.querySelector("enclosure");
        let itunesLength = episode.getElementsByTagNameNS(this.namespace, "duration")[0].textContent;
        let audioLength = !itunesLength ? itunesLength : enclosure.getAttribute("length");
        let thumbnail = episode.getElementsByTagNameNS(this.namespace, "image")[0];
        let thumbnaiURL = thumbnail ? thumbnail.getAttribute("href") : podcast.thumbnail;
        this.db.put("episodes", {
          ID: guid,
          podcastID: podcast.ID,
          title: episode.querySelector("title").textContent,
          url: secureUrl(thumbnaiURL),
          description: episode.querySelector("description").textContent,
          pubDate: epsiodeDate,
          audio: secureUrl(episode.querySelector("enclosure").getAttribute("url")),
          audioLength: Number.parseInt(audioLength),
          audioType: enclosure.getAttribute("type"),
          playedLength: 0,
          isDownloaded: false,
          podcastTitle: podcast.title
        });
      }
    } 
  }


  playClickEventHandler(event: Event) {
    console.log("Play", event);
    this._playStatus = PlayStatus.Play;
  }

  playStartEventHandler(event: Event) {
    console.log("Playing", event);
    this._playStatus = PlayStatus.Playing;
  }

  pauseEventHandler(event: Event) {
    console.log("Pause", event);
    this._playStatus = PlayStatus.Paused;
  }

  PlayCompletedEventHandler(event: Event) {
    console.log("End", event);
    this._playStatus = PlayStatus.Paused;
  }

  waitingEventHandler(event: Event) {
    console.log("Loading", event);
    //this._playStatus = PlayStatus.Loading;
  }



  render() {

    const tunnelState = {
      play: this.play,
      episode: this._episode,
      playStatus: this._playStatus
    }

    return (

      <Tunnel.Provider state={tunnelState}>
        <slot></slot>
      </Tunnel.Provider>

    );
  }

}
