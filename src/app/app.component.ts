import { Component } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private screenOrientation: ScreenOrientation
  ) {
    this.setLandscape();

    this.screenOrientation.onChange().subscribe(() => {
        this.setLandscape();
    });

  }

  setLandscape() {
    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }
}
