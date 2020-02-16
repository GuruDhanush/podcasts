import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'scroll-infinite',
  styleUrl: 'infinite.css',
  shadow: true
})
export class Infinite {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
