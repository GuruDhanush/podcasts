import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'app-playbar',
  styleUrl: 'playbar.css',
  shadow: true
})
export class Playbar {

  @Prop() podcastThumbnail = "https://cdn-images-1.listennotes.com/podcasts/star-wars-7x7-star-wars-news-interviews-and-AIg3cZVKCsL.300x300.jpg"
  @Prop() EpisodeTitle = "Episode 1 | Star wars"



  render() {
    return (
      <div class="bar">
        <img src={this.podcastThumbnail} />
        <span class="title">{this.EpisodeTitle} </span>
        <button>
          Play
        </button>
      </div>
    );
  }

}
