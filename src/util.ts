


export class Podcast {
    id: string;
    title: string;
    thumbnail: string;
    latest_pub_date_ms: number;
    episodes: Episodes[];
    publisher: string;
    description: string;

  }

 export  class Episodes {
    id: string;
    title: string;
    pub_date_ms: number;
    description: string;
    audio: string;
    audio_length_sec: number;
    thumbnail: string;
  }


  export function getReadableDay(date: number) {
    let dayOfWeek = new Date(date).getDay()
    return isNaN(dayOfWeek) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
  }