import { Component, h } from '@stencil/core';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})
export class AppRoot {

  render() {
    return (
      <div class='root' >
        <header>
          <h1>Podcasts</h1>
        </header>

        <main>
          <podcast-player>
            <stencil-router>
              <stencil-route-switch scrollTopOffset={0}>
                <stencil-route url='/' component='app-home' exact={true} />
                {/* <stencil-route url='/profile/:name' component='app-profile' /> */}
              </stencil-route-switch>
            </stencil-router>
          </podcast-player>
        </main>

      </div>
    );
  }
}
