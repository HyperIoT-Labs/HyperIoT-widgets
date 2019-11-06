import { Component, ViewEncapsulation } from '@angular/core';

import { DataStreamService, DataPacketFilter } from '@hyperiot/core';

import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-sensor-value',
  templateUrl: './sensor-value.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './sensor-value.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SensorValueComponent extends WidgetComponent {
  timestamp = new Date();
  sensorField: string;
  sensorValue: number;
  sensorUnitSymbol: string;
  isActivityLedOn = false;
  private ledTimeout: any = null;

  callBackEnd : boolean = false;

  constructor(public dataStreamService: DataStreamService) {
    super(dataStreamService);
  }

  pause(): void {
    throw new Error('Method not implemented.');
  }
  play(): void {
    throw new Error('Method not implemented.');
  }
  getOfflineData(startDate: Date, endDate: Date) {
    throw new Error('Method not implemented.');
  }

  onToolbarAction(action: string) {
    this.widgetAction.emit({widget: this.widget, action});
  }

  configure() {
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && this.widget.config.packetFields.length > 0)) {
      this.isConfigured = false;
      // set callback end
      this.callBackEnd = true;
      return;
    }
    // reset fields
    this.sensorValue = null;
    this.sensorField = name;

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
      const fieldIds = Object.keys(cfg.packetFields);
      if (fieldIds.length > 0) {
        const name = cfg.packetFields[fieldIds[0]];
        const value = +field[name];
        switch (name) {
          case 'temperature':
            this.displayTemperature(name, value, cfg.displayUnit);
            break;
          case 'humidity':
            this.displayHumidity(name, value, cfg.displayUnit);
            break;
          default:
            this.sensorField = name;
            this.sensorValue = Math.round(value * 10) / 10;
            this.sensorUnitSymbol = '';
          }
        }
    });
  }

  displayTemperature(name: string, value: number, unit: string) {
    if (unit == null) {
      unit = 'celsius';
    }
    // apply configured display unit
    switch (unit.toLowerCase()) {
      case 'fahrenheit':
        // convert value from celsius to Fahrenheit
        value = (value * 9 / 5) + 32;
        this.sensorUnitSymbol = '&#8457;';
        break;
      case 'kelvin':
        value = value + 273.15;
        this.sensorUnitSymbol = '&#8490;';
        break;
      default:
        this.sensorUnitSymbol = '&#8451;';
        break;
    }
    // round up to 1 decimal digit
    this.sensorValue = Math.round(value * 10) / 10;
    this.sensorField = name;
  }

  displayHumidity(name: string, value: number, unit: string) {
    this.sensorUnitSymbol = '%';
    this.sensorValue = Math.round(value * 10) / 10;
    this.sensorField = name;
  }

  blinkLed() {
    this.isActivityLedOn = true;
    if (this.ledTimeout != null) {
      clearTimeout(this.ledTimeout);
      this.ledTimeout = null;
    }
    this.ledTimeout = setTimeout(() => this.isActivityLedOn = false, 100);
  }

}
