import { Component, Prop, h } from '@stencil/core';
import {  getReadableDay } from '../../util';

@Component({
  tag: 'app-showcard',
  styleUrl: 'showcard.css',
  shadow: true
})
export class Showcard {

  @Prop() podcastThumbnail: string  = 'https://cdn-images-1.listennotes.com/podcasts/star-wars-7x7-star-wars-news-interviews-and-AIg3cZVKCsL.300x300.jpg'
  @Prop() podcastTitle: string = 'The Daily'
  @Prop() created?: Date;
  @Prop() publisher : string = "New York Times"


  render() {
    return (
      <div class="play-card">
          <img class="podcast-img" src={this.podcastThumbnail} ></img>
          <div class="podcast-info">
            <div class="podcast-title">{this.podcastTitle}</div>
            <div class="podcast-lastupd">{this.created ? 'Updated ' + getReadableDay(this.created) + ' - ' : ''  + this.publisher}</div>
          </div>
      </div>
    );

  }
}