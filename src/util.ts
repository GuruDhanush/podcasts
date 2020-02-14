


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
  
  export function getReadableDay(date: number) {

    let currentDate = new Date();
    let episodeDate = new Date(date);
    if(currentDate.getMilliseconds() - 604800000 > date) {
      return getWeek(episodeDate.getDay());
    }
    if(currentDate.getFullYear() - episodeDate.getFullYear() > 0) {
      return episodeDate.getFullYear() + ' ' + getMonth(episodeDate.getMonth()) + ' ' + episodeDate.getDate()
    }
    return getMonth(episodeDate.getMonth()) + ' ' + episodeDate.getDate()
  }

  