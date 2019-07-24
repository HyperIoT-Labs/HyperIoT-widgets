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
    this.showChart();
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:chart':
        this.showChart();
        break;
      case 'toolbar:table':
        this.showChartTable();
        break;
    }
    this.widgetAction.emit({widget: this.widget, action});
  }

  private showChart() {
    // get chart data from JSON asset file
    if (this.widget.dataUrl != null) {
      this.http.get(this.widget.dataUrl)
        .subscribe((data: any) => {
          this.graph.data = data.data;
          Object.assign(this.graph.layout, data.layout);
          this.checkConfigured();
        });
    } else {
      this.graph.data = this.widget.config.data || [];
      this.graph.layout = this.widget.config.layout;
      this.checkConfigured();
    }
  }

  private checkConfigured() {
    this.isConfigured = (this.graph.data != null && this.graph.data.length > 0);
  }

  private showChartTable() {
    // get chart data from JSON asset file
    if (this.widget.dataTableUrl != null) {
      this.http.get(this.widget.dataTableUrl)
        .subscribe((data: any) => {
          this.graph.data = data.data;
          Object.assign(this.graph.layout, data.layout);
        });
    } else {
      this.graph.data = this.widget.config.tableData || [];
      this.graph.layout = this.widget.config.tableLayout;
    }
  }

}
