import { Component, ViewEncapsulation } from '@angular/core';

import { DataPacketFilter, DataStreamService } from '@hyperiot/core';

import { PlotlyService } from 'angular-plotly.js';
import { WidgetsService } from '../widgets.service';

import { WidgetChartComponent } from '../widget-chart.component';

@Component({
  selector: 'hyperiot-gauge-value',
  templateUrl: './gauge-value.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './gauge-value.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GaugeValueComponent extends WidgetChartComponent {
  sensorValue = 0;
  timestamp = new Date();

  callBackEnd = false;

  constructor(
    public dataStreamService: DataStreamService,
    public plotly: PlotlyService,
    public plotlyModal: PlotlyService,
    private widgetsService: WidgetsService
  ) {
    super(dataStreamService, plotly, plotlyModal);
  }

  configure() {
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && Object.keys(this.widget.config.packetFields).length > 0)) {
      this.isConfigured = false;

      setTimeout(() => {
        this.callBackEnd = true;
      }, 500);

      return;
    }
    // TODO: ...
    this.graph.data = this.widget.config.data || [];
    this.graph.layout = this.widget.config.layout;

    setTimeout(() => {
      this.callBackEnd = true;
    }, 500);

    // reset fields
    this.sensorValue = null;
    // subscribe data stream
    const cfg = this.widget.config;
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      this.timestamp = eventData[0];
      const field = eventData[1];
      // get the sensor field name and value
      const fieldIds = Object.keys(cfg.packetFields);
      if (fieldIds.length > 0) {
        const name = cfg.packetFields[fieldIds[0]];
        let value = +field[name];
        // Apply unit conversion to packet field if set
        if (cfg.packetUnitsConversion) {
          const unitConversion = cfg.packetUnitsConversion.find((uc) => uc.field.id == fieldIds[0]);
          if (unitConversion) {
            if (unitConversion.convertFrom !== unitConversion.convertTo) {
              value = this.widgetsService
                .convert(value)
                .from(unitConversion.convertFrom)
                .to(unitConversion.convertTo);
            }
            // round to configured decimal digits TODO: not implemented
            //value = (+value).toFixed(unitConversion.decimals);
          }
        }
        // set the new graph value
        this.graph.data[0].value = value;
        console.log('Secondo Chekc Graph Data:\n', this.graph.data);
        }
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
