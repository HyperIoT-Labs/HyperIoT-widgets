import { Component, AfterContentInit } from '@angular/core';

import { DataStreamService } from '@hyperiot/core';

import { PlotlyService } from 'angular-plotly.js';

import { WidgetComponent } from './widget.component';
import { TimeSeries } from './data/time-series';

@Component({
  selector: 'hyperiot-widget-chart',
  template: ''
})
/**
 * A widget for visualizing time series chart
 */
export class WidgetChartComponent extends WidgetComponent implements AfterContentInit {
  /**
   * From inherited 'widget' property the following
   * custom configuration fields can be passed:
   *
   * @example
   * this.widget = {
   *   // mandatory widget identifier field
   *   id: 1234,
   *   // attach resize event handler
   *   resize: () => console.log('resized'),
   *   // attach change event handler
   *   change: () => console.log('changed'),
   *   // follow other custom fields used by the widget (optional)
   *   config: {
   *     packetId: 14,
   *     packetFields: [
   *        'temperature',
   *        'humidity'
   *     ],
   *     // Time range to display in seconds
   *     timeAxisRange: 20,
   *     // Max data points to display, older entries
   *     // will be deleted once new data is pushed
   *     maxDataPoints: 100,
   *     // Max time window in seconds. Older data will be deleted.
   *     timeWindow: 60,
   *     // The following array is used to set configuration and layout
   *     // options of each series.
   *     // See [Plotly documentation]{@link https://plot.ly/javascript/} for all available
   *     // configuration and layout settings.
   *     seriesConfig: [{
   *       series: 'temperature',
   *       config: { yaxis: 'y2' },
   *       layout: {
   *         yaxis2: {
   *           title: 'temperature',
   *           titlefont: {color: '#00f'},
   *           tickfont: {color: '#00f'},
   *           anchor: 'free',
   *           overlaying: 'y',
   *           side: 'right',
   *           position: 1,
   *           range: [-50, 50]
   *         }
   *       }
   *     },
   *     {
   *       series: 'humidity',
   *       layout: {
   *         yaxis: {
   *           title: 'humidity',
   *           titlefont: {color: 'darkorange'},
   *           tickfont: {color: 'darkorange'}
   *         }
   *       }
   *     }]
   *   }
   * };
   *
   */

  /**
   * Structure that stores actual configuration for the Plotly chart
   */
  graph = {
    data: [],
    layout: {
      responsive: true,
      autosize: true,
      margin: { l: 0, r: 0, t: 8, b: 0, pad: 0 },
      font: {
        size: 9
      },
      title: null,
      xaxis: {
        showgrid: false,
        range: []
      },
      yaxis: {
        domain: [ 0.15, 0.85 ]
      }
    }
  };
  isPaused: boolean;

  private defaultSeriesConfig = {
    type: 'scatter',
    mode: 'lines',
    line: { simplify: false, width: 2, smoothing: 1.3 },
    connectgaps: true
  };

  private relayoutTimeout = null;
  private relayoutTimestamp;

  constructor(
    public dataStreamService: DataStreamService,
    public plotly: PlotlyService
  ) {
    super(dataStreamService);
  }

  configure() {
    super.configure();
    this.graph.data = [];
    // not sure how to get rid of this timeout
    setTimeout(() => {
      const Plotly = this.plotly.getPlotly();
      const graph = this.plotly.getInstanceByDivId(`widget-${this.widget.id}`);
      if (graph != null) {
        Plotly.relayout(graph, { autosize: true });
      }
    }, 1000);
  }

  // Base class abstract methods implementation

  pause(): void {
    this.isPaused = true;
  }

  play(): void {
    this.isPaused = false;
  }

  // WidgetChartComponent public methods

  /**
   * Adds new time series to the chart
   *
   * @param timeSeriesData Array of time series
   */
  addTimeSeries(timeSeriesData: TimeSeries[], config?: any): void {
    timeSeriesData.forEach(ts => {
      const tsd = {
        name: ts.name,
        x: ts.x.slice(),
        y: ts.y.slice()
      };
      // copy default settings
      Object.assign(tsd, this.defaultSeriesConfig);
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

  /**
   * Adds new data to a time series.
   *
   * @param series The series to add data to
   * @param x The x value (Date)
   * @param y The y value (number)
   */
  bufferData(series: TimeSeries, x: Date, y: number): void {
      // NOTE: `series` is just a local copy of chart data,
      // NOTE: the real data is stored in the plotly graph object
      series.x.push(x);
      series.y.push(y);
      series.lastBufferIndexUpdated++;
  }

  /**
   * Adds new data to a time series.
   *
   * @param series The series to add data to
   * @param x The x value (Date)
   * @param y The y value (number)
   */
  bufferMutipleData(series: TimeSeries, xValues: Date[], yValues: number[]): void {
    // NOTE: `series` is just a local copy of chart data,
    // NOTE: the real data is stored in the plotly graph object
    for(let i = 0; i < xValues.length;i++){
      series.x.push(xValues[i]);
      series.y.push(yValues[i]);
    }  
    series.lastBufferIndexUpdated += xValues.length;
  }

  /**
   * Render all series inside a chart
   * @param series 
   * @param Plotly 
   * @param graph 
   */
  renderAllSeriesData(series:TimeSeries[],Plotly,graph){
    for (let s = 0; s < series.length; s++) {
        let serieIndex = s;
        let bufferedSerie = series[s];
        this.renderSeriesData(bufferedSerie,serieIndex,Plotly,graph);
      }
  }

  /**
   * Render single serie
   * @param series 
   * @param serieIndex 
   * @param Plotly 
   * @param graph 
   */
  renderSeriesData(series: TimeSeries,serieIndex,Plotly,graph):void{
    if(!this.isPaused){
      // keeps data length < this.maxDataPoints
      this.applySizeConstraints(series);
      // reset x axis range to default
      this.requestRelayout(series.x[series.x.length-1]);
      //updating only if there's data
      if(series.x.length > 0 && series.y.length > 0){
          let xValues:Date[] = series.x.splice(0,series.lastBufferIndexUpdated);
          let yValues:number[] = series.y.splice(0,series.lastBufferIndexUpdated);
          if(this.widget.config.maxDataPoints > 0){
            Plotly.extendTraces(graph, {
                x: [xValues],
                y: [yValues]
            }, [serieIndex], this.widget.config.maxDataPoints);
          } else {
              Plotly.extendTraces(graph, {
                x: [xValues],
                y: [yValues]
            }, [serieIndex]);
          }
        }
    }
  }

  applyStoredConfig(timeSeriesData: any) {
    const config = this.widget.config;
    if (config.layout != null) {
      Object.assign(this.graph.layout, config.layout);
    }
    const sc = config.seriesConfig.find((cfg) => cfg.series === timeSeriesData.name);
    if (sc != null) {
      Object.assign(timeSeriesData, sc.config);
    }
  }

  // Private methods

  private requestRelayout(lastEventDate: Date) {
    this.relayoutTimestamp = lastEventDate;
    if (this.relayoutTimeout === null) {
      this.relayoutTimeout = setTimeout(() => {
        this.relayoutTimeout = null;
        this.relayout(this.relayoutTimestamp);
      }, 100);
    }
  }
  private relayout(lastEventDate: Date) {
    // set x range to the last 30 seconds of data
    const rangeEnd = new Date(lastEventDate);
    const rangeStart = new Date(rangeEnd.getTime() - (1 * this.widget.config.timeAxisRange * 1000));
    // relayout x-axis range with new data
    const Plotly = this.plotly.getPlotly();
    const graph = this.plotly.getInstanceByDivId(`widget-${this.widget.id}`);
    if (graph) {
      Plotly.relayout(graph, {
        'xaxis.range': [rangeStart, rangeEnd],
        'xaxis.domain': [0.125, 1 - (0.075) * (this.graph.data.length - 1)]
      });
    }
  }

  private applySizeConstraints(data: TimeSeries) {
    const cfg = this.widget.config;
    if (data.x.length > cfg.maxDataPoints && cfg.maxDataPoints > 0) {
      data.x.splice(0, data.x.length - cfg.maxDataPoints);
      data.y.splice(0, data.y.length - cfg.maxDataPoints);
      data.lastBufferIndexUpdated = 0
    }
    if(data.x.length > 0){
      const endDate = data.x[data.x.length - 1].getTime();
      while (
        cfg.timeWindow > 0 &&
        data.x.length > 0 &&
        (endDate - data.x[0].getTime()) / 1000 > cfg.timeWindow
      ) {
        data.x.shift();
        data.y.shift();
      }
    }
  }
}
