import { Component } from '@angular/core';

import { DataPacketFilter } from '@hyperiot/core';
import { WidgetChartComponent } from '../widget-chart.component';

@Component({
  selector: 'hyperiot-gauge-value',
  templateUrl: './gauge-value.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './gauge-value.component.css']
})
export class GaugeValueComponent extends WidgetChartComponent {
  sensorValue = 0;
  timestamp = new Date();

  configure() {
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && this.widget.config.packetFields.length > 0)) {
      this.isConfigured = false;
      return;
    }
    // TODO: ...
    this.graph.data = this.widget.config.data || [];
    this.graph.layout = this.widget.config.layout;
    // reset fields
    this.sensorValue = null;
    // subscribe data stream
    const cfg = this.widget.config;
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      this.timestamp = eventData[0];
      const field = eventData[1];
      // get the sensor field name and value
      const name = cfg.packetFields[0];
      const value = +field[name];
      // set the new graph value
      this.graph.data[0].value = value;
    });
  }

  onToolbarAction(action: string) {
    // TODO: ....
    switch (action) {
      default:
    }
    this.widgetAction.emit({widget: this.widget, action});
  }

}
