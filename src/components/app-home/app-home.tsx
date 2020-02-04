import { Component, h,getAssetPath, Element, State, Listen } from '@stencil/core';
import { Podcast } from '../../util.js'

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true
})


export class AppHome {


  async componentDidLoad() {
    await this.loadResult();
  }

  @Listen('tabChanged')
  selectedChangedHandler(event: CustomEvent) {
    this.page = event.detail;
  }
  
  @State() page : number = 0


  @Element() el: HTMLElement;

  @State() podcasts: Podcast[] = [];

  async loadResult() {

      let response = await fetch(getAssetPath('/assets/result.json'), {  headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }});
      let data = await response.json();
      this.podcasts = [ data as Podcast]
      console.log(this.podcasts);
  }

 
  render() {
    return (
      <div class='app-home' >

        <app-tabbar page={this.page} tabLabels={['Episodes', 'Shows']} ></app-tabbar>

        <div class="main-content">
        {this.page == 1 ? 
        <div class="episodes">
           {this.podcasts.map((podcast) =>
           <app-showcard key={podcast.id} podcastThumbnail={podcast.thumbnail} podcastTitle={podcast.title} created={podcast.latest_pub_date_ms} publisher={podcast.publisher}  ></app-showcard>
        )}

        </div>
        :<div class="shows">
          {this.podcasts[0].episodes.map((episode) =>
           <app-playcard key={episode.id} podcastThumbnail={episode.thumbnail} episodeTitle={episode.title} podcastTitle={this.podcasts[0].title} episodeDescription={episode.description} created={episode.pub_date_ms} playUrl={episode.audio}  ></app-playcard>
          )}
        </div>
        }
        </div>
        

        {/* <app-playbar class="playbar" ></app-playbar> */}

        {/* <stencil-route-link url='/profile/stencil'>
          <button>
            Profile page
          </button>
        </stencil-route-link> */}
      </div>
    );
  }
}
