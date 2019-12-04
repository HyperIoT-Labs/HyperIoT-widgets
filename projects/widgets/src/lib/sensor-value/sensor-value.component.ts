import { Component, ViewEncapsulation } from '@angular/core';

import { DataStreamService, DataPacketFilter } from '@hyperiot/core';
import { WidgetsService } from '../widgets.service';

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
  sensorValue: string;
  sensorUnitSymbol: string;
  isActivityLedOn = false;
  private ledTimeout: any = null;

  callBackEnd = false;

  constructor(
    public dataStreamService: DataStreamService,
    private widgetsService: WidgetsService
  ) {
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
        // set display values
        this.sensorField = name;
        this.sensorUnitSymbol = '';
        // Apply unit conversion to packet field if set
        let unitConversion;
        if (cfg.packetUnitsConversion) {
          unitConversion = cfg.packetUnitsConversion.find((uc) => uc.field.id == fieldIds[0]);
          if (unitConversion) {
            this.sensorUnitSymbol = unitConversion.convertFrom;
            if (unitConversion.convertFrom !== unitConversion.convertTo) {
              this.sensorValue = this.widgetsService
                .convert(+value)
                .from(unitConversion.convertFrom)
                .to(unitConversion.convertTo);
              this.sensorUnitSymbol = unitConversion.convertTo;
            } else {
              this.sensorValue = value.toString();
            }
          }
        }
        if (!unitConversion) {
          // round to 2 decimal digits if no unit conversion is configured
          this.sensorValue = (+value).toFixed(2);
        } else if (!isNaN(unitConversion.decimals)) {
          // round to configured decimal digits
          this.sensorValue = (+this.sensorValue).toFixed(unitConversion.decimals);
        }
      }
    });
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
