import { Component, h, Prop, getAssetPath } from '@stencil/core';
import { getReadableDay, Episode, PlayStatus } from '../../util';
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
  @Prop() created: Date;
  @Prop() playUrl: string;

  playImage = 'play_circle.svg';
  pauseImage = 'pause_circle.svg';

    
  togglePlayButton(episode : Episode, playStatus: PlayStatus) {
    if(episode && episode.audio == this.playUrl) {
      if(playStatus === PlayStatus.Play) {
        return getAssetPath(`/assets/${this.pauseImage}`);
      }
      else if(playStatus === PlayStatus.Loading) {
        return getAssetPath(`/assets/${this.pauseImage}`);
      }
      else if(playStatus === PlayStatus.Paused) {
        return getAssetPath(`/assets/${this.playImage}`);
      }
      else if(playStatus === PlayStatus.Playing) {
        return getAssetPath(`/assets/${this.pauseImage}`);
      }
    }
    return getAssetPath(`/assets/${this.playImage}`);
  }


  render() {
    return (
      <div>
        <Tunnel.Consumer>
          {({  play, episode, playStatus }) => (
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
                    <img src={this.togglePlayButton(episode, playStatus)} />
                  </button>
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

  
 

}
