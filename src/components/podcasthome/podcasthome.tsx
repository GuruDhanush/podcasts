import { Component, h, State, Prop } from '@stencil/core';
import { PodDB, Episode1, Podcast1 } from '../../util';
import { MatchResults } from '@stencil/router';
import { IDBPDatabase, openDB } from 'idb';

@Component({
  tag: 'app-podcasthome',
  styleUrl: 'podcasthome.css',
  shadow: true
})
export class Podcasthome {

  
  async componentDidLoad() {
    await this.loadResult();
  }

  @State() Episodes: Episode1[]
  @Prop() match: MatchResults;
  @State() podcast: Podcast1;

  db: IDBPDatabase<PodDB>;

  async loadResult() {
    let podcastID = decodeURIComponent(this.match.params.podcastID);
    this.db = await openDB<PodDB>('pod-db', 1, {});
    this.podcast = await this.db.transaction("podcasts").store.get(podcastID);
    let cursor = await this.db.transaction("episodes").store.index("pubDate").openCursor(null, "prev");
    let count = 0;
    let episodes = [];
    while(cursor && count<20) {
      if(cursor.value.podcastID == podcastID) {
        count++;
        episodes.push(cursor.value);
      } 
      cursor = await cursor.continue();
    }
    this.Episodes = episodes;
  }

  
//   async loadResult() {

//     let response = await fetch(getAssetPath('/assets/result.json'), {  headers : { 
//       'Content-Type': 'application/json',
//       'Accept': 'application/json'
//      }});
//     let data = await response.json();
//     this.Episodes = [ data as Podcast][0].episodes;
//     //console.log(this.podcasts);
// }

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
           <app-playcard key={episode.ID} 
              podcastThumbnail={episode.url} 
              episodeTitle={episode.title} 
              podcastTitle={this.podcast.title}
              episodeDescription={episode.description} 
              created={episode.pubDate} 
              playUrl={episode.audio} >
            </app-playcard>
          )}
        </div>

      </div>
    );
  }

}
