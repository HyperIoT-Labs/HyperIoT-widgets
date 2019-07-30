import { Component } from '@angular/core';

import { DataStreamService, DataPacketFilter } from '@hyperiot/core';

import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-sensor-value',
  templateUrl: './sensor-value.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './sensor-value.component.css']
})
export class SensorValueComponent extends WidgetComponent {
  sensorField: string;
  sensorValue: number;
  sensorUnitSymbol: string;

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
    if (!(this.widget.config != null && this.widget.config.packetId != null && this.widget.config.packetFields != null)) {
      this.isConfigured = false;
      return;
    }
    const cfg = this.widget.config;
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      const date = eventData[0];
      const field = eventData[1];
      // get the sensor field name and value
      const name = cfg.packetFields[0];
      const value = +field[name];
      switch (name) {
        case 'temperature':
          this.displayTemperature(name, value, cfg.displayUnit);
          break;
        case 'humidity':
          this.displayHumidity(name, value, cfg.displayUnit);
          break;
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

}
