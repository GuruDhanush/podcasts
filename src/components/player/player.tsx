import { Component, h, State, Element } from '@stencil/core';
import Tunnel from '../data/audio';
import { Episode } from '../../util';
import { setAudioMetadata } from '../../metadata-utils';


@Component({
  tag: 'podcast-player',
  shadow: true
})

export class Player {

  @State() _episode: Episode = { audio: null };
  @Element() el: HTMLElement
  @State() audio :HTMLAudioElement = new Audio();
  @State() _isPlaying: boolean = !(this.audio.paused || this.audio.seeking);



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
      this._isPlaying = true;
    }
    else {
      this.audio.pause();
      this._isPlaying = false;
    }
  }







  render() {

    const tunnelState = {
      play: this.play,
      episode: this._episode,
      isPlaying: this._isPlaying
    }

    return (

      <Tunnel.Provider state={tunnelState}>
        <slot></slot>
      </Tunnel.Provider>

    );
  }

}
