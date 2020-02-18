import { DBSchema } from 'idb'


export interface PodDB extends DBSchema {
  podcasts: {
    key: string;
    value: Podcast1;
    indexes: { 'pubDate': Date }
  };
  episodes: {
    key: string;
    value: Episode1;
    indexes: { 'pubDate': Date, 'podcastID': string };
  };
  homeStore: {
    key: string;
    value: string;
  };
  offlineStore: {
    key: string;
    value: string;
  }
}

export class Podcast1 {
  ID: string;
  title: string;
  url: string;
  description: string;
  pubDate?: Date;
  thumbnail?: string;
  ttl?: number; 
  publisher: string;
}

export class Episode1 {
  ID: string;
  podcastID: string
  title: string;
  url: string;
  description: string;
  pubDate?: Date;
  category?: string[];
  audio: string;
  audioLength: number;
  playedLength: number = 0;
  isDownloaded: boolean = false;
  audioType?: string;
}

export class HomeStore {
  onlineID: string[];
  offlineID: string[];
}


export class Podcast {
    id: string;
    title: string;
    thumbnail: string;
    latest_pub_date_ms: number;
    episodes: Episode[];
    publisher: string;
    description: string;

  }

 export  class Episode {
    id?: string;
    title?: string;
    pub_date_ms?: number;
    description?: string;
    audio?: string;
    audio_length_sec?: number;
    thumbnail?: string;
  }

  export enum PlayStatus {
    Play,
    Playing,
    Paused,
    Loading,
    Completed
  }


  function getMonth(month: number) {
    return isNaN(month) ? null : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month];
  }

  function getWeek(week: number) {
    return isNaN(week) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][week];
  }
  
  export function getReadableDay(givendate: Date) {

    let currentDate = new Date();
    if(currentDate.getMilliseconds() - 604800000 > givendate.getMilliseconds()) {
      return getWeek(givendate.getDay());
    }
    if(currentDate.getFullYear() - givendate.getFullYear() > 0) {
      return givendate.getFullYear() + ' ' + getMonth(givendate.getMonth()) + ' ' + givendate.getDate()
    }
    return getMonth(givendate.getMonth()) + ' ' + givendate.getDate()
  }

  export function secureUrl(url: string) : string {
    if(url.startsWith("http://")){
      url = url.replace("http://", "https://");
    }

    return url;
  }

  