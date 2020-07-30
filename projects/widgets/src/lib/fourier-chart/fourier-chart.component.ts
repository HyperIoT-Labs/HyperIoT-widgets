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

  lastSampleTick = 0;
  samplesDuration = 0;
  samplesSize = [];

  constructor(
    public dataStreamService: DataStreamService,
    public plotly: PlotlyService
) {
    super(dataStreamService, plotly);
  }

  configure() {
    super.configure();
    this.chartData = [];
    this.samplesDuration = 0;
    this.samplesSize = [];
    this.lastSampleTick = 0;

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
    cfg.layout.margin = {
      l: 32,
      r: 0,
      b: 32,
      t: 0,
      pad: 0
    };
    cfg.seriesConfig = cfg.seriesConfig || [];
    // cfg.packetId = this.widget.config.packetId || cfg.packetId;
    // cfg.packetFields = this.widget.config.packetFields || cfg.packetFields;
    // Set counter for configuring series axes
    let axisCount = 0;
    // Create time series to display for this chart
    const seriesItems: TimeSeries[] = [];
    // Set layout for the first two axes
    Object.keys(cfg.packetFields).forEach((fieldId) => {
      const fieldName = cfg.packetFields[fieldId];
      seriesItems.push(new TimeSeries(fieldName));
      // Set the chart axis and legend
      axisCount++;
      cfg.seriesConfig[axisCount - 1] = {
        series: fieldName,
      };
    });
    this.chartData.push(...seriesItems);

    setTimeout(()=> {
      this.callBackEnd = true;
    }, 500);

    // Bind time series to the chart
    this.addFftSeries(this.chartData);

    // Create the real time data channel
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);

    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      const date = eventData[0]; // TODO: this field is actually ignored
      const field = eventData[1];
      // Map received packet field to the corresponding time series
      Object.keys(field).map((k) => {
        const fieldId = this.getFieldIdFromName(k);
        const fieldName = cfg.packetFields[fieldId];
        const valuesArray = field[k].map(v => {
          // value might be an object with one field with the type name (eg. {double: 22.2})
          const keys = Object.keys(v);
          return keys.length > 0 ? v[keys[0]] : v;
        });

        if (!Array.isArray(valuesArray)) {
          console.log('WARNING: FourierChart input data is not an array!');
          return;
        }

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
        if (series != null && !this.isPaused) {
          const Plotly = this.plotly.getPlotly();
          const graph = this.plotly.getInstanceByDivId(`widget-${this.widget.id}`);
          const sampleDuration = +this.widget.config.sampleRate;
          const sampleTick = sampleDuration / valuesArray.length;

          // recreate time ticks for all values in the current sample
          const timeOffset = this.widget.config.timeAxis ? date.getTime() : 0;
          if (timeOffset > 0 && this.lastSampleTick === 0) {
            this.lastSampleTick = timeOffset;
          }
          const timestamps = [];
          for (let i = 0; i < valuesArray.length; i++) {
            const relativeTimestamp = this.lastSampleTick + sampleTick*i;
            if (timeOffset > 0) {
              const ts = new Date(relativeTimestamp);
              timestamps.push(ts);
            } else {
              timestamps.push(relativeTimestamp);
            }
          }
          this.lastSampleTick += sampleDuration;

          const bufferSamples = this.widget.config.bufferSamples || 20;
          if (this.samplesSize.length >= bufferSamples) {
            this.samplesSize.shift();
          }
          this.samplesSize.push(valuesArray.length);
          if (graph) {
            Plotly.extendTraces(graph, {
                x: [timestamps],
                y: [valuesArray]
            }, [seriesIndex], this.samplesSize.reduce((a, b) => a + b, 0));

            // set x range to show only showSamples samples
            const showSamples = this.widget.config.showSamples || 2;
            let rangeStart = this.samplesDuration - (sampleDuration * (showSamples - 1));
            if (this.widget.config.timeAxis) {
              rangeStart = (this.lastSampleTick - sampleDuration) - (sampleDuration * (showSamples - 1));
            }
            const rangeEnd = rangeStart + (sampleDuration * showSamples);
            // relayout x-axis range with new data
            if (graph) {
              Plotly.relayout(graph, {
                'xaxis.range': [rangeStart, rangeEnd],
              });
              /*
              Plotly.animate(graph, {
                layout: {
                  xaxis: {range: [rangeStart, rangeEnd]},
                }
              }, {
                transition: {
                  duration: 500,
                  easing: 'cubic-in-out'
                }
              });
              */
            }

            this.samplesDuration += sampleDuration;
          }
        }
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

  addFftSeries(timeSeriesData: TimeSeries[], config?: any): void {
    timeSeriesData.forEach(ts => {
      const tsd = {
        name: ts.name,
        x: ts.x,
        y: ts.y,
        line: {
//          dash:	'dot',
          shape: 'linear',
          width: 1,
//          color: '#1f77b4',
          simplify: true
        },
        type: 'scatter'
      };
      // apply config options stored in `this.seriesConfig` parameter
      this.applyStoredConfig(tsd);
      // override any setting passed via `config`
      if (config) {
        Object.assign(tsd, config);
      }
      // FIXME: should replace item with same index
      this.graph.data.push(tsd);
    });
  }

  private getFieldIdFromName(fieldName) {
    const cfg = this.widget.config;
    for (const id of Object.keys(cfg.packetFields)) {
      if (cfg.packetFields[id] === fieldName) {
        return id;
      }
    }
  }
}
