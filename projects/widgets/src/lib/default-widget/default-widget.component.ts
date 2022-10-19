import { Component } from '@angular/core';
import { WidgetComponent } from '../widget.component';
import { DataStreamService } from '@hyperiot/core';

@Component({
  selector: 'hyperiot-default-widget',
  templateUrl: './default-widget.component.html',
  styleUrls: ['./default-widget.component.css']
})
export class DefaultWidgetComponent extends WidgetComponent {

  constructor(
    public dataStreamService: DataStreamService
  ) {
    super(dataStreamService);
  }

  play(): void { }

  pause(): void { }

  onToolbarAction(action: string) {
    this.widgetAction.emit({ widget: this.widget, action });
  }

}
