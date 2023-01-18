import { Component } from '@angular/core';
import { version } from 'projects/widgets/package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public version: string = version;
  title = 'HyperIoT-widgets';
}
