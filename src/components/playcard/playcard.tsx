//@ts-nocheck
import { Component, h, Prop,getAssetPath } from '@stencil/core';
import {  getReadableDay } from '../../util';


@Component({
  tag: 'app-playcard',
  styleUrl: 'playcard.css',
  shadow: true,
  assetsDirs: ['assets']
})
export class Playcard {


  @Prop() podcastThumbnail = 'https://cdn-images-1.listennotes.com/podcasts/star-wars-7x7-star-wars-news-interviews-and-AIg3cZVKCsL.300x300.jpg'
  @Prop() episodeTitle = 'episode1'
  @Prop() podcastTitle = 'Star Wars 7x7 | Star Wars News, Interviews, and More!'
  @Prop() episodeDescription = 'There are only so many hours in a day so you need to build a business that can grow while you’re sleeping...'
  @Prop() created : number;
  @Prop() playUrl;
  


  @Prop() playImage = 'play_circle.svg';



  setAudioMetadata() {
    if (!'mediaSession' in window.navigator) {
      return
    }

      let audio : HTMLAudioElement = window['podcast'];

      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.episodeTitle,
        //artist: this.,
        album: this.podcastTitle,
        artwork: [
          { src: this.podcastThumbnail }
        ]
      });
    
      let skipTime = 15; 

      navigator.mediaSession.setActionHandler('seekbackward', function() {
        audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
      });

      navigator.mediaSession.setActionHandler('seekforward', function() {
        audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
      });

  }

  async onClickPlay() {
   
    if(window['podcast'] == null) {
      window['podcast'] = new Audio();
    }
   
    let pod : HTMLAudioElement = window['podcast']


    if(pod.src != this.playUrl) {
      pod.pause();
      pod.src = this.playUrl
      pod.load();
    }
    

    if(pod.paused || pod.seeking) {
      pod.play()
      .then(_ => this.setAudioMetadata())
      .catch(err => console.log('audio metadata error ' + err))
    }
    else {
      pod.pause();
    }

  }



  render() {
    return (
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
            <button onClick={() => this.onClickPlay()}>
              <img src={getAssetPath(`./assets/${this.playImage}`)}/>
            </button>
           
          </div>
          <div class="podcast-created">{ 'Last Updated ' + getReadableDay(this.created)}</div>
          {/* <button class="download">Download</button> */}
        </div>
        <div class="play-progress">

        </div>
      </div>
    );
  }

}
