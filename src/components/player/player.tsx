import { Component, h, State } from '@stencil/core';
import Tunnel from '../data/audio';
import { Episode, PlayStatus } from '../../util';
import { setAudioMetadata } from '../../metadata-utils';


@Component({
  tag: 'podcast-player',
  shadow: true
})

export class Player {

  @State() _episode: Episode = { audio: null };
  @State() _playStatus: PlayStatus = null;
  audio :HTMLAudioElement = new Audio();



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

  componentWillLoad() {
    this.audio.addEventListener('play', this.playStartEventHandler.bind(this));
    this.audio.addEventListener('playing', this.playStartEventHandler.bind(this));
    this.audio.addEventListener('pause', this.pauseEventHandler.bind(this));
    this.audio.addEventListener('end', this.PlayCompletedEventHandler.bind(this));
    this.audio.addEventListener('waiting', this.waitingEventHandler.bind(this));

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
