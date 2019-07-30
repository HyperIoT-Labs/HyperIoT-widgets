import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { PacketSelectComponent } from '../packet-select/packet-select.component';

@Component({
  selector: 'app-time-chart-settings',
  templateUrl: './time-chart-settings.component.html',
  styleUrls: ['./time-chart-settings.component.css']
})
export class TimeChartSettingsComponent implements OnInit, OnDestroy {
  @ViewChild(PacketSelectComponent, {static: true}) packetSelect: PacketSelectComponent;
  @Input() modalApply: Subject<any>;
  @Input() widget;
  seriesTitle = 'Untitled';

  ngOnInit() {
    this.seriesTitle = this.widget.config.seriesConfig[0].layout.title.text;
    this.modalApply.subscribe((event) => {
        if (event === 'apply') {
          this.apply();
        }
    });
  }
  ngOnDestroy() {
    this.widget.config.seriesConfig[0].layout.title.text = this.seriesTitle;
    this.modalApply.unsubscribe();
  }

  apply() {
    this.packetSelect.apply();
  }
}
