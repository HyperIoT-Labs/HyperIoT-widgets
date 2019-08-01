import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-stats-chart-settings',
  templateUrl: './stats-chart-settings.component.html',
  styleUrls: ['./stats-chart-settings.component.css']
})
export class StatsChartSettingsComponent implements OnInit, OnDestroy {
  @Input() modalApply: Subject<any>;
  @Input() widget;
  seriesTitle = 'Untitled';
  dataUrl: string;
  dataTableUrl: string;

  ngOnInit() {
    // TODO: ....
    //if (this.widget.config.data == null) {
    //  Object.assign(this.widget.config, this.defaultData);
    //}
    //this.seriesTitle = this.widget.config.seriesConfig[0].layout.title.text;
    this.dataUrl = this.widget.dataUrl;
    this.dataTableUrl = this.widget.dataTableUrl;
    this.modalApply.subscribe((event) => {
        if (event === 'apply') {
          this.apply();
        }
    });
  }

  ngOnDestroy() {
    this.modalApply.unsubscribe();
  }

  apply() {
    // TODO: ...
    this.widget.dataUrl = this.dataUrl;
    this.widget.dataTableUrl = this.dataTableUrl;
  }
}
