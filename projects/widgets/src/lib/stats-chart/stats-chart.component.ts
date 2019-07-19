import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PlotlyService } from 'angular-plotly.js';

import { DataStreamService } from '@hyperiot/core';

import { WidgetChartComponent } from '../widget-chart.component';

@Component({
  selector: 'hyperiot-stats-chart',
  templateUrl: './stats-chart.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './stats-chart.component.css']
})
export class StatsChartComponent extends WidgetChartComponent implements OnInit {

  // This constructor Inject the HTTP client
  // just for testing purposes.
  // The real implementation should relay on
  // HyperIoT REST API client implementation
  constructor(dataStreamService: DataStreamService, plotly: PlotlyService, private http: HttpClient) {
    super(dataStreamService, plotly);
  }

  ngOnInit() {
    // get moked chart data from JSON asset file
    this.http.get(this.widget.dataUrl)
      .subscribe((data: any) => {
        this.graph.data = data.data;
        Object.assign(this.graph.layout, data.layout);
      });
  }

}
