import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardOfflineDataService, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { WidgetComponent } from '../widget.component';
import { WidgetsService } from '../widgets.service';
import * as moment from 'moment';

@Component({
  selector: 'hyperiot-hpacket-table',
  templateUrl: './hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HpacketTableComponent extends WidgetComponent {

  callBackEnd = false;
  hPacketId: number;
  isPaused: boolean;
  DEFAULT_MAX_TABLE_LINES = 50;
  @ViewChild('tableChild', {static: false}) tableChild;
  array: object[] = [];
  pRequest;
  tableSource: Subject<any[]> = new Subject<any[]>();
  timestamp = new Date();
  tableHeaders = [];
  totalLength = 0;

  offlineDataSubscription: Subscription;

  constructor(
    public dataStreamService: DataStreamService,
    private dashboardOfflineDataService: DashboardOfflineDataService,
    private widgetsService: WidgetsService
  ) {
    super(dataStreamService);
  }

  private applyUnitConvertion(packetUnitsConversion, element) {
    const keys = Object.keys(element);    // packet field names
    keys.forEach(key => {
      const unitConversion = packetUnitsConversion.find((uc) => uc.field.name == key);
      if (unitConversion) {
        let value = element[key];
        if (unitConversion.convertFrom !== unitConversion.convertTo) {
          value = this.widgetsService
            .convert(value)
            .from(unitConversion.convertFrom)
            .to(unitConversion.convertTo);
        }
        // round to configured decimal digits
        value = (+value).toFixed(unitConversion.decimals);
        element[key] = value;
      }
    });
  }

  configure() {
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && Object.keys(this.widget.config.packetFields).length > 0)) {
      this.isConfigured = false;
      // set callback end
      setTimeout(() => {
        this.callBackEnd = true;
      }, 500);
      return;
    }
    // Set Callback End
    setTimeout(() => {
      this.callBackEnd = true;
    }, 500);

    // Set header
    const fieldIds = Object.keys(this.widget.config.packetFields);
    if (fieldIds.length > 0) {
      this.tableHeaders = [];
      fieldIds.forEach(hPacketFieldId => this.tableHeaders.push(this.widget.config.packetFields[hPacketFieldId]));
      this.tableHeaders.push(this.widget.config.timestampFieldName);  // display timestamp too
    }

    // set data source
    this.setDatasource();
  }

  private setDatasource(): void {
    if (this.hPacketId !== this.widget.config.packetId) {
      if (this.hPacketId) {
        this.dashboardOfflineDataService.removeWidget(this.widget.id, this.hPacketId);
      }
      this.hPacketId = this.widget.config.packetId;
      this.dashboardOfflineDataService.addWidget(this.widget.id, this.hPacketId);
    }
    if (this.offlineDataSubscription) {
      this.offlineDataSubscription.unsubscribe();
    }
    this.offlineDataSubscription = this.dashboardOfflineDataService.getPacketDataSubject(this.hPacketId).subscribe(
      res => {
        this.totalLength = res;
        this.tableChild.resetTable(this.totalLength, true);
      });
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:play':
        this.play();
        break;
      case 'toolbar:pause':
        this.pause();
        break;
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

  pageRequest(rowsIndexes) {
    if (this.pRequest) {
      this.pRequest.unsubscribe();
    }
    this.pRequest = this.dashboardOfflineDataService.getData(this.hPacketId, rowsIndexes).subscribe(
      res => {
        const pageData = [];
        const realIndexes = [];
        realIndexes[0] = rowsIndexes[0] % this.DEFAULT_MAX_TABLE_LINES;
        realIndexes[1] = (rowsIndexes[1] % this.DEFAULT_MAX_TABLE_LINES !== 0) ? rowsIndexes[1] % this.DEFAULT_MAX_TABLE_LINES : this.DEFAULT_MAX_TABLE_LINES;
        const asd = res.values.slice(realIndexes[0], realIndexes[1]);
        asd.forEach(a => {
          const element = this.tableHeaders.reduce((prev, curr) => { prev[curr] = this.getDatum(a.fields, curr); return prev; }, {});
          const timestampFieldName = this.widget.config.timestampFieldName;
          element[timestampFieldName] = moment(element[timestampFieldName]).format('L') + ' ' + moment(element[timestampFieldName]).format('LTS');
          if (this.widget.config.packetUnitsConversion)
            this.applyUnitConvertion(this.widget.config.packetUnitsConversion, element);
          pageData.push(element);
        });
        this.tableSource.next(pageData);
      },
      err => {
        // TODO send eror to table
        console.log(err);
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
