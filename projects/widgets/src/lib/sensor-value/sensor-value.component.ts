import { Component, ViewEncapsulation,OnDestroy } from '@angular/core';

import { DataStreamService, DataPacketFilter } from '@hyperiot/core';
import { WidgetsService } from '../widgets.service';

import { WidgetSingleValueComponent } from '../widget-single-value.component';
import { DataValue } from '../data/data-value';
import { UnitFormatterService } from '../util/unit-formatter.service';


@Component({
  selector: 'hyperiot-sensor-value',
  templateUrl: './sensor-value.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './sensor-value.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SensorValueComponent extends WidgetSingleValueComponent implements OnDestroy {
  timestamp = new Date();
  sensorField: string;
  sensorRenderValue: string = null;
  sensorUnitSymbol: string;
  isActivityLedOn = false;
  private ledTimeout: any = null;

  callBackEnd = false;

  constructor(
    public dataStreamService: DataStreamService,
    private widgetsService: WidgetsService,
    private unitFormatterService: UnitFormatterService
  ) {
    super(dataStreamService);
  }

  ngOnDestroy(){
    this.stopRefreshTask();
  }

  pause(): void {
    throw new Error('Method not implemented.');
  }
  play(): void {
    throw new Error('Method not implemented.');
  }

  onToolbarAction(action: string) {
    this.widgetAction.emit({ widget: this.widget, action });
  }

  configure() {
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && Object.keys(this.widget.config.packetFields).length > 0)) {
      this.isConfigured = false;
      // set callback end
      this.callBackEnd = true;
      return;
    }
    // reset fields
    this.resetValue();
  
    // Set Callback End
    this.callBackEnd = true;

    // subscribe data stream
    const cfg = this.widget.config;
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      this.timestamp = eventData[0];
      const field = eventData[1];
      this.blinkLed();
      // get the sensor field name and value
      let dataValue:DataValue = this.unitFormatterService.format(cfg,this.timestamp,field);
      this.sensorField = dataValue.getName();
      this.sensorUnitSymbol = dataValue.getUnit();  
      let newValue = dataValue.getValue();
      this.updateValue(newValue);
    });
    // refresh rate default 1 sec
    this.startRefreshTask(cfg.refreshIntervalMillis?cfg.refreshIntervalMillis:1000)
  }

  blinkLed() {
    this.isActivityLedOn = true;
    if (this.ledTimeout != null) {
      clearTimeout(this.ledTimeout);
      this.ledTimeout = null;
    }
    this.ledTimeout = setTimeout(() => this.isActivityLedOn = false, 100);
  }

  protected renderData(){
    this.sensorRenderValue = this.getValue();
  }
}
