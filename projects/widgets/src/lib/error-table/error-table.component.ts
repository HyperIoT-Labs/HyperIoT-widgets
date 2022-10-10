import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardOfflineDataService, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { WidgetComponent } from '../widget.component';
import * as moment_ from 'moment';
import { TableEvent, TableHeader } from '@hyperiot/components';

const moment = moment_;

@Component({
  selector: 'hyperiot-error-table',
  templateUrl: './error-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './error-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorTableComponent extends WidgetComponent {

  TABLE_LIMIT = 400;
  callBackEnd = false;
  hPacketId: number;
  isPaused: boolean;
  DEFAULT_MAX_TABLE_LINES = 50;
  @ViewChild('tableChild', {static: false}) tableChild;
  array: object[] = [];
  pRequest;
  tableSource: Subject<TableEvent> = new Subject<TableEvent>();
  timestamp = new Date();
  tableHeaders: TableHeader[] = [];
  totalLength = 0;

  offlineDataSubscription: Subscription;

  errorPacketId: number;
  errorMessageFieldName: string;
  errorPacketFieldName: string;
  errorPacketTimestampFieldName: string;


  constructor(
    public dataStreamService: DataStreamService,
    public dataStreamServiceModal: DataStreamService,
    private dashboardOfflineDataService: DashboardOfflineDataService
  ) {
    super(dataStreamService, dataStreamServiceModal);
    this.errorPacketId = -2;
    this.hPacketId = this.errorPacketId;
    this.errorMessageFieldName = 'error';
    this.errorPacketFieldName = 'packet';
    this.errorPacketTimestampFieldName = 'timestamp';
  }

  configure() {
    super.configure();
    this.widget.config.packetId = this.errorPacketId;
    this.widget.config.timestampFieldName = this.errorPacketTimestampFieldName;
    this.widget.config.packetFields = {};
    this.widget.config.packetFields[this.errorPacketId] = this.errorMessageFieldName
    this.tableHeaders.push({ value: this.widget.config.packetFields[this.errorPacketId]});
    this.tableHeaders.push({ value: this.errorPacketFieldName});
    this.tableHeaders.push({ value: this.widget.config.timestampFieldName});
    setTimeout(() => {
      this.callBackEnd = true;
    }, 500);
    // set data source
    this.setDatasource();
  }

  private setDatasource(): void {
    this.dashboardOfflineDataService.addWidget(this.widget.id, this.hPacketId);
    this.widgetAction.emit({ widget: this.widget, action: 'widget:ready'});
    this.offlineDataSubscription = this.dashboardOfflineDataService.getPacketDataSubject(this.hPacketId).subscribe(
      res => {
        this.totalLength = res;
        this.tableChild.resetTable(this.totalLength, true);
      });
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:close': {
        this.dashboardOfflineDataService.removeWidget(this.widget.id, this.hPacketId);
        break;
      }
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  getDatum(array, name) {
    return array.some(y => y.name === name) ? array.find(y => y.name === name).value : '-';
  }

  dataRequest(lowerBound) {
    if (this.pRequest) {
      this.pRequest.unsubscribe();
    }
    this.pRequest = this.dashboardOfflineDataService.getData(this.hPacketId, "", lowerBound).subscribe(
      res => {
        const pageData = [];
        res.forEach(a => {
          if (pageData.length >= this.TABLE_LIMIT) {
            return;
          }
          const element = this.tableHeaders.map(x=>x.value).reduce((prev, curr) => { prev[curr] = this.getDatum(a.fields, curr); return prev; }, {});
          const timestampFieldName = this.widget.config.timestampFieldName;
          element[timestampFieldName] = moment(element[timestampFieldName]).format('L') + ' ' + moment(element[timestampFieldName]).format('LTS');
          pageData.push(element);
        });
        this.tableSource.next({type:'DATA', values: pageData});
        if (pageData.length >= this.TABLE_LIMIT) {
          this.tableSource.next({type:'EVENT', event: 'LIMIT_REACHED'});
        }
        if (pageData.length >= this.totalLength) {
          this.tableSource.next({type:'EVENT', event: 'DATA_END'});
        }
      },
      err => {
        // TODO send eror to table
        this.tableSource.error(err);
      }
    );
  }

  play(): void {
    this.isPaused = false;
  }

  pause(): void {
    this.isPaused = true;
  }

}
