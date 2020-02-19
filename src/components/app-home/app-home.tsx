import { Component, h, Element, State, Listen } from '@stencil/core';
import { PodDB, Podcast1, Episode1 } from '../../util.js'
import { IDBPDatabase, openDB } from 'idb';


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

  @State() page: number = 0


  @Element() el: HTMLElement;

  @State() podcasts: Podcast1[] = [];
  @State() episodes: Episode1[] = [];

  db: IDBPDatabase<PodDB>;

  async loadResult() {
    this.db = await openDB<PodDB>('pod-db', 1, {})
    this.podcasts  =await this.db.getAll("podcasts");
    let cursor = await this.db.transaction("episodes").store.index("pubDate").openCursor(null, "prev");
    let count = 0;
    let episodes = [];
    while(cursor && count<20) {
      count++;
      episodes.push(cursor.value);
      cursor = await cursor.continue();
    }
    this.episodes = episodes;
  }







  render() {
    return (
      <div class='app-home' >

        <app-tabbar page={this.page} tabLabels={['Episodes', 'Shows']} ></app-tabbar>

        <div class="main-content">
          {this.page == 1 ?
            <div class="episodes">
              {this.podcasts.map((podcast) =>
                <stencil-route-link url={'/podcast/'+ encodeURIComponent(podcast.ID)}>
                  <app-showcard key={podcast.ID}
                    podcastThumbnail={podcast.thumbnail}
                    podcastTitle={podcast.title}
                    created={podcast.pubDate}
                    publisher={podcast.publisher}>
                  </app-showcard>
                </stencil-route-link>

              )}

            </div>
            : <div class="shows">
              {this.episodes.map((episode) =>
                <app-playcard key={episode.ID}
                  podcastID = {episode.ID}
                  podcastTitle={episode.podcastTitle}
                  podcastThumbnail={episode.url}
                  episodeTitle={episode.title}
                  episodeDescription={episode.description}
                  created={episode.pubDate}
                  playUrl={episode.audio}
                  isdownloaded = {episode.isDownloaded} >
                </app-playcard>
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

