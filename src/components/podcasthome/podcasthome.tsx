import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-podcasthome',
  styleUrl: 'podcasthome.css',
  shadow: true
})
export class Podcasthome {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
