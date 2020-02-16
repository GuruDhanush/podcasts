import { Component, h, State } from '@stencil/core';
import Tunnel from '../data/audio';
import { Episode, PlayStatus, Podcast1, PodDB } from '../../util';
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
      }
    });

    await this.loadRecords();
  }

  async loadRecords() {

    let res = new DOMParser()
      .parseFromString(await (await fetch('https://cors.x7.workers.dev/https://feeds.megaphone.fm/the-daily-show')).text(), 'application/xml');

    //console.log(res);
    await this.loadChannel(res);
  }

  async loadChannel(channel: Document) {
    let podcast: Podcast1 = {
      ID: channel.querySelector("link").textContent,
      publisher: channel.getElementsByTagNameNS(this.namespace, "author")[0].textContent,
      title: channel.querySelector("title").text,
      description: channel.querySelector("description").textContent,
      url: channel.querySelector("link").textContent,
      thumbnail: channel.querySelector("image url").textContent
    }

    if(!await this.db.getKey("podcasts", podcast.ID)) {
      this.db.put("podcasts", podcast);
    }

    await this.loadEpisodes(channel, podcast);
  }

  async loadEpisodes(episodes: Document, podcast: Podcast1) {

    episodes.querySelectorAll("item").forEach( async (value) => {
      let guid = value.querySelector("guid").textContent;
      if(!await this.db.getKeyFromIndex("episodes", "podcastID", guid)) {
        let enclosure = value.querySelector("enclosure");
        let itunesLength = value.getElementsByTagNameNS(this.namespace, "duration")[0].textContent;
        let audioLength = !itunesLength ? itunesLength : enclosure.getAttribute("length");
        let thumbnail = value.getElementsByTagNameNS(this.namespace, "image")[0];
        let thumbnaiURL = thumbnail ? thumbnail.getAttribute("href") : podcast.thumbnail;
        this.db.put("episodes", {
          ID: guid,
          podcastID: podcast.ID,
          title: value.querySelector("title").textContent,
          url: thumbnaiURL,
          description: value.querySelector("description").textContent,
          pubDate: new Date(value.querySelector("pubDate").textContent),
          audio: value.querySelector("enclosure").getAttribute("url"),
          audioLength: Number.parseInt(audioLength),
          audioType: enclosure.getAttribute("type"),
          playedLength: 0,
          isDownloaded: false
        });
      }
    }); 
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
