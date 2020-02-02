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

  async onClickPlay() {
   
    if(window['podcast'] == null) {
      window['podcast'] = new Audio();
      // let pod : HTMLAudioElement = window['podcast']
      // pod.src = this.playUrl;
      // pod.play()
    }
    // else {
    //   let pod : HTMLAudioElement = window['podcast'];
    //   if(pod.src == this.playUrl) {
    //     if(pod.paused) {
    //       pod.play()
    //     } 
    //     else {
    //       pod.pause();
    //     }
    //   }
    //   else {
    //     window['podcast'] = new Audio();
    //     pod.src = this.playUrl;
    //     pod.play()
    //   } 
    // }

    let pod : HTMLAudioElement = window['podcast']


    if(pod.src != this.playUrl) {
      pod.pause();
      pod.src = this.playUrl
      pod.load();
    }
    

    if(pod.paused || pod.seeking) {
      pod.play();
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
