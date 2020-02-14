import { createProviderConsumer } from "@stencil/state-tunnel";
import { Episode, PlayStatus } from "../../util";
import { h } from '@stencil/core';

export interface State {
  episode?: Episode,
  play?: (episode: Episode, podcastTitle: string) => void,
  playStatus?: PlayStatus,
  togglePlayButton?: (playUrl : string) => string
}

export default createProviderConsumer<State>(
  {
  },
  (subscribe, child) => (
    <context-consumer subscribe={subscribe} renderer={child} />
  )
);