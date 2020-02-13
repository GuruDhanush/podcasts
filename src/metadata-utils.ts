//@ts-nocheck


import { Episode } from "./util";



export function setAudioMetadata(audio: HTMLAudioElement, episode : Episode, podcastTitle : string) {
    if (!'mediaSession' in window.navigator) {
      return
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: episode.title,
      //artist: this.,
      album: podcastTitle,
      artwork: [
        { src: episode.thumbnail }
      ]
    });

    let skipTime = 15;

    navigator.mediaSession.setActionHandler('seekbackward', function () {
      audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
    });

    navigator.mediaSession.setActionHandler('seekforward', function () {
      audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
    });

    try {
      navigator.mediaSession.setActionHandler('seekto', function (event) {
        if (event.fastSeek && ('fastSeek' in audio)) {
          audio.fastSeek(event.seekTime);
          return;
        }
        audio.currentTime = event.seekTime;
      });
    } catch (error) {
      console.log('Warning! The "seekto" media session action is not supported.');
    }

  }