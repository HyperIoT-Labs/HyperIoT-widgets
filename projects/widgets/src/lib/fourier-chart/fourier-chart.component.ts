import {
  Component, ViewEncapsulation
} from '@angular/core';

import { DataPacketFilter, DataStreamService } from '@hyperiot/core';

import { PlotlyService } from 'angular-plotly.js';
import { WidgetsService } from '../widgets.service';

import { WidgetChartComponent } from '../widget-chart.component';
import { TimeSeries } from '../data/time-series';

@Component({
  selector: 'hyperiot-fourier-chart',
  templateUrl: './fourier-chart.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './fourier-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FourierChartComponent extends WidgetChartComponent {
  private chartData: TimeSeries[] = [];

  callBackEnd = false;

  constructor(
    public dataStreamService: DataStreamService,
    public plotly: PlotlyService,
    private widgetsService: WidgetsService
  ) {
    super(dataStreamService, plotly);
  }

  configure() {
    super.configure();
    this.chartData = [];

    //console.log('configure data init', this.chartData);

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
    const cfg = this.widget.config;
    cfg.layout = cfg.layout || {};
    cfg.layout.margin = cfg.layout.margin || {
      l: 0,
      r: 32,
      b: 0,
      t: 0,
      pad: 0
    };
    cfg.seriesConfig = cfg.seriesConfig || [];
    // cfg.packetId = this.widget.config.packetId || cfg.packetId;
    // cfg.packetFields = this.widget.config.packetFields || cfg.packetFields;
    // Set counter for configuring series axes
    let axisCount = 0;
    const axesConfig = {
      layout: {}
    };
    const sideMarginGap = 0.12;
    let sideMargin = 1 - (sideMarginGap * (this.getMappedFieldsCount() - 2));
    // Create time series to display for this chart
    const seriesItems: TimeSeries[] = [];
    // Set layout for the first two axes
    Object.keys(cfg.packetFields).forEach((fieldId) => {
      this.mapField(fieldId, (fieldName) => {
        seriesItems.push(new TimeSeries(fieldName));
        // Set the chart axis and legend
        axisCount++;
        cfg.seriesConfig[axisCount - 1] = {
          series: fieldName,
        };
        switch (axisCount) {
          case 1:
            Object.assign(axesConfig.layout, {
              yaxis: {
                title: fieldName,
                domain: [ 0.15, 0.85 ]
              }
            });
            break;
          default:
            const axisConfig = {};
            axisConfig[`yaxis${axisCount}`] = {
              title: fieldName,
              autorange: true,
              anchor: 'free',
              overlaying: 'y',
              side: 'right',
              position: sideMargin
            };
            Object.assign(axesConfig.layout, axisConfig);
            Object.assign(cfg.seriesConfig[axisCount - 1], { config: {
              yaxis: 'y' + axisCount
            }});
            sideMargin += sideMarginGap;
            break;
        }
      });
    });
    Object.assign(cfg.layout, axesConfig.layout);
    this.chartData.push(...seriesItems);

    //console.log('Chart Data 2: ' ,this.chartData);

    setTimeout(()=> {
      this.callBackEnd = true;
    }, 500);

    // Bind time series to the chart
    this.addTimeSeries(this.chartData);

    // Create the real time data channel
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);

    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      const date = eventData[0];
      // TODO: This code must be adapted to work with array of values
      // TODO: This code must be adapted to work with array of values
      // TODO: This code must be adapted to work with array of values
      const field = eventData[1];
      // Map received packet field to the corresponding time series
      Object.keys(field).map((k) => {
        const fieldId = this.getFieldIdFromName(k);
        this.mapField(fieldId, (fieldName, mappedField) => {
          let value = field[k];
          let series = null;
          let seriesIndex = -1;
          for (let s = 0; s < this.chartData.length; s++) {
              const cs = this.chartData[s];
              if (cs.name === fieldName) {
                  series = cs;
                  seriesIndex = s;
                  break;
              }
          }
          if (series != null) {
            if (mappedField) {
              mappedField.coords.split(',').forEach((c) => {
                value = value[+c];
              });
            }
            // Apply unit conversion to packet field if set
            if (cfg.packetUnitsConversion) {
              const unitConversion = cfg.packetUnitsConversion.find((uc) => uc.field.id == fieldId);
              if (unitConversion) {
                if (unitConversion.convertFrom !== unitConversion.convertTo) {
                  value = this.widgetsService
                    .convert(value)
                    .from(unitConversion.convertFrom)
                    .to(unitConversion.convertTo);
                }
                // round to configured decimal digits
                value = (+value).toFixed(unitConversion.decimals);
              }
            }
            // Add processed value to time-series
            this.addTimeSeriesData(series, date, value);
            const Plotly = this.plotly.getPlotly();
            const graph = this.plotly.getInstanceByDivId(`widget-${this.widget.id}`);
            if (graph) {
                Plotly.extendTraces(graph, {
                    x: [[date]],
                    y: [[value]]
                }, [seriesIndex], this.widget.config.maxDataPoints);
            }}
        });
      });
    });
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:play':
        this.isPaused = false;
        this.play();
        break;
      case 'toolbar:pause':
        this.isPaused = false;
        this.pause();
        break;
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  private getFieldIdFromName(fieldName) {
    const cfg = this.widget.config;
    for (const id of Object.keys(cfg.packetFields)) {
      if (cfg.packetFields[id] === fieldName) {
        return id;
      }
    }
  }
  private mapField(fieldId: any, callback) {
    const cfg = this.widget.config;
    // apply field mappings (this is the case of packet field type ARRAY / MATRIX )
    let fieldMapping;
    if (cfg.packetFieldsMapping) {
      fieldMapping = cfg.packetFieldsMapping.find((fm) => fm.field.id == fieldId);
    }
    if (fieldMapping) {
      fieldMapping.map.forEach((m) => {
        callback(cfg.packetFields[fieldId] + ':' + m.name, m);
      });
    } else {
      callback(cfg.packetFields[fieldId]);
    }
  }
  private getMappedFieldsCount() {
    const cfg = this.widget.config;
    let count = 0;
    for (const fieldId of Object.keys(cfg.packetFields)) {
      if (cfg.packetFieldsMapping) {
        const fieldMapping = cfg.packetFieldsMapping.find((fm) => fm.field.id == fieldId);
        if (fieldMapping) {
          count += fieldMapping.map.length - 1;
        }
      }
      count++;
    }
    return count;
  }
}
