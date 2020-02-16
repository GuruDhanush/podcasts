import { Component, getAssetPath, h, State, Prop } from '@stencil/core';
import { Podcast, Episode } from '../../util';
import { MatchResults } from '@stencil/router';

@Component({
  tag: 'app-podcasthome',
  styleUrl: 'podcasthome.css',
  shadow: true
})
export class Podcasthome {

  
  async componentDidLoad() {
    await this.loadResult();
  }

  @State() Episodes: Episode[]
  @Prop() match: MatchResults;

  
  async loadResult() {

    let response = await fetch(getAssetPath('/assets/result.json'), {  headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }});
    let data = await response.json();
    this.Episodes = [ data as Podcast][0].episodes;
    //console.log(this.podcasts);
}

  render() {
    return (
      <div class="podcast-home">
        {/* <div class="home-header">
          <div class="home-title">
            <div class="title">The Daily</div>
            <div class="publisher">The New York Times</div>
          </div>
          <img class="podcast-img" src=""></img>
        </div>
        <div class="control-bar">
          <button>Subscribe</button>
          <button>Site</button>
          <button>Share</button>
        </div>
        <div class="description">
          This is an dummy description
        </div> */}
        <div class="epsiodes-list">
        {this.Episodes.map((episode) =>
           <app-playcard key={episode.id} 
              podcastThumbnail={episode.thumbnail} 
              episodeTitle={episode.title} 
              podcastTitle={this.match.params.podcastName}
              episodeDescription={episode.description} 
              created={new Date()} 
              playUrl={episode.audio} >
            </app-playcard>
          )}
        </div>

      </div>
    );
  }

}
