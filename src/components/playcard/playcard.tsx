import { Component, h, Prop, getAssetPath } from '@stencil/core';
import { getReadableDay, Episode } from '../../util';
import Tunnel from '../data/audio';


@Component({
  tag: 'app-playcard',
  styleUrl: 'playcard.css',
  shadow: true
})
export class Playcard {


  @Prop() podcastThumbnail: string;
  @Prop() episodeTitle: string;
  @Prop() podcastTitle: string;
  @Prop() episodeDescription: string;
  @Prop() created: number;
  @Prop() playUrl: string;

  playImage = 'play_circle.svg';
  pauseImage = 'pause_circle.svg';



    
  togglePlayButton(episode : Episode, isPlaying: boolean) {
    if (episode && episode.audio == this.playUrl && isPlaying) {
      return getAssetPath(`/assets/${this.pauseImage}`);
    }
    return getAssetPath(`/assets/${this.playImage}`);
  }





  render() {
    return (
      <div>
        <Tunnel.Consumer>
          {({  play, episode, isPlaying }) => (
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
                  <button onClick={() => play({ title: this.episodeTitle, audio: this.playUrl, thumbnail: this.podcastThumbnail, description: this.episodeDescription }, this.podcastTitle)}>
                    <img src={this.togglePlayButton(episode, isPlaying)} />
                  </button>
                </div>
                <div class="podcast-created">{'Last Updated ' + getReadableDay(this.created)}</div>
              </div>
            </div>
          )}
        </Tunnel.Consumer>
      </div>
    );
  }

}
