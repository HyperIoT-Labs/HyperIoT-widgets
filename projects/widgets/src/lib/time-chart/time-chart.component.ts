import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { DataPacketFilter } from '@hyperiot/core';

import { WidgetChartComponent } from '../widget-chart.component';
import { TimeSeries } from '../data/time-series';

@Component({
  selector: 'hyperiot-time-chart',
  templateUrl: './time-chart.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './time-chart.component.css']
})
export class TimeChartComponent extends WidgetChartComponent implements OnInit, OnDestroy {
  private chartData: TimeSeries[] = [];

  ngOnInit() {
    const cfg = this.widget.config;
    cfg.packetId = this.widget.config.packetId || cfg.packetId;
    cfg.packetFields = this.widget.config.packetFields || cfg.packetFields;
    // Create time series to display for this chart
    const seriesItems: TimeSeries[] = [];
    cfg.packetFields.forEach((fieldName) => {
      seriesItems.push(new TimeSeries(fieldName));
    });
    this.chartData.push(...seriesItems);
    // Bind time series to the chart
    this.addTimeSeries(this.chartData);
    // Create the real time data channel
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      const date = eventData[0];
      const field = eventData[1];
      // Map received packet field to the corresponding time series
      Object.keys(field).map((k) => {
        const series = this.chartData.find((ts) => ts.name === k);
        if (series != null) {
          this.addTimeSeriesData(series, date, field[k]);
        }
      });
    });
    /*
    // get some history data to prepend to
    // the realtime data before now
    const startDate = new Date();
    const pastDate = new Date(startDate.getTime());
    pastDate.setDate(pastDate.getDate() - 1);
    this.getOfflineData(pastDate, startDate);
    */
  }
  togglePlay() {
    this.isPaused = !this.isPaused;
    this.isPaused ? this.pause() : this.play();
  }
}
