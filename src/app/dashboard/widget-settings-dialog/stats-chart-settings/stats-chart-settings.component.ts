import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-stats-chart-settings',
  templateUrl: './stats-chart-settings.component.html',
  styleUrls: ['./stats-chart-settings.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class StatsChartSettingsComponent implements OnInit, OnDestroy {
  @Input() modalApply: Subject<any>;
  @Input() widget;
  dataUrl: string;
  dataTableUrl: string;
  seriesTitle = 'Untitled';
  private defaultConfig = {
    data: [],
    layout: {
      title: {
        font: {
          size: 14,
          color: '#16A4FA'
        },
        xref: 'container',
        yref: 'container',
        x: 0,
        y: 1,
        pad: {
          t: 10,
          l: 10
        },
        text: '<b>Untitled</b>'
      },
      xaxis: {
        tickangle: -45
      }
    }
  };

  constructor(public settingsForm: NgForm) { }

  ngOnInit() {
    if (this.widget.config.data == null || this.widget.config.data.length === 0) {
      Object.assign(this.widget.config, this.defaultConfig);
    }
    this.seriesTitle = this.widget.config.layout.title.text;
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
    this.widget.config.layout.title.text = this.seriesTitle;
    this.widget.dataUrl = this.dataUrl;
    this.widget.dataTableUrl = this.dataTableUrl;
  }
}
