import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PlotlyService } from 'angular-plotly.js';

import { DataStreamService } from '@hyperiot/core';

import { WidgetChartComponent } from '../widget-chart.component';

@Component({
  selector: 'hyperiot-stats-chart',
  templateUrl: './stats-chart.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './stats-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatsChartComponent extends WidgetChartComponent {
  
  private chartMode = 'chart';
  callBackEnd : boolean = false;

  // This constructor Inject the HTTP client
  // just for testing purposes.
  // The real implementation should relay on
  // HyperIoT REST API client implementation
  constructor(dataStreamService: DataStreamService, plotly: PlotlyService, private http: HttpClient) {
    super(dataStreamService, plotly);
  }

  configure() {
    super.configure();
    if (this.chartMode === 'table') {
      this.showChartTable();
    } else {
      this.showChart();
    }
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:chart':
        this.chartMode = 'chart';
        this.configure();
        break;
      case 'toolbar:table':
          this.chartMode = 'table';
          this.configure();
          break;
    }
    this.widgetAction.emit({widget: this.widget, action});
  }

  private checkConfigured() {
    this.isConfigured = (this.graph.data != null && this.graph.data.length > 0)
                        || (this.widget.dataUrl != null && this.widget.dataUrl.length > 0);
  }

  private showChart() {
    // get chart data from JSON asset file
    if (this.widget.dataUrl != null && this.widget.dataUrl.trim().length > 0) {

      this.http.get(this.widget.dataUrl).subscribe(
        (data: any) => {
          this.graph.data = data.data;
          Object.assign(this.graph.layout, data.layout);
          this.checkConfigured();
        },
        (err) => {
          console.log('ERRORE NEL CARICAMENTO DEI DATI', err);
        },
        () => {
          setTimeout(() => {
            this.callBackEnd = true;
          }, 500);
        }
      );

    } else if (this.widget.config) {

      this.graph.data = this.widget.config.data || [];
      this.graph.layout = this.widget.config.layout;

      setTimeout(() => {
        this.callBackEnd = true;
      }, 500);

    }
    this.checkConfigured();
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
