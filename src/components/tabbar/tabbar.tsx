import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'app-tabbar',
  styleUrl: 'tabbar.css',
  shadow: true
})
export class Tabbar {


  @Prop() page = 0;

  @Prop() tabLabels: string[];

  @Event({
    eventName: 'tabChanged',
  }) tabChanged: EventEmitter;

  onInputChange(event) {
    let tab : HTMLElement = event.target
    let currentPage = Number.parseInt(tab.id.split('-')[1]);
    if(currentPage != this.page) {
      this.page = currentPage;
      this.tabChanged.emit(currentPage)
    }
  }

  render() {
    return (
      <Host>
        <div class="tabs">

          {this.tabLabels.map((tabLabel, index) =>
            <div>
              <label class="label" style={ this.page == index ? {'color': 'var(--app-text-primary-color)'} : {}} >
                <input id={'tab-' + index.toString()} type="radio" class="input" name="tabs"
                 checked={this.page == index ? true : false}
                 onInput={(event) => this.onInputChange(event)}
                 value='' ></input> 
                {tabLabel}
              </label>
            </div>
          )}
        </div>
      </Host>
    );
  }

}
