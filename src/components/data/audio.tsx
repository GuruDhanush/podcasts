import { createProviderConsumer } from "@stencil/state-tunnel";
import { Episode, PlayStatus } from "../../util";
import { h } from '@stencil/core';
import { IDBPDatabase } from "idb";

export interface State {
  episode?: Episode,
  play?: (episode: Episode, podcastTitle: string) => void,
  playStatus: PlayStatus,
  togglePlayButton?: (playUrl : string) => string,
  db?: IDBPDatabase
}

export default createProviderConsumer<State>(
  {
    playStatus: PlayStatus.Paused
  },
  (subscribe, child) => (
    <context-consumer subscribe={subscribe} renderer={child} />
  )
);