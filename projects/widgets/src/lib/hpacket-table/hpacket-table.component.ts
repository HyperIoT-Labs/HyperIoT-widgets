import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardOfflineDataService, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { WidgetComponent } from '../widget.component';
import { WidgetsService } from '../widgets.service';
import { DateFormatterService } from '../util/date-formatter.service';
import { TableEvent, TableHeader } from '@hyperiot/components';

@Component({
  selector: 'hyperiot-hpacket-table',
  templateUrl: './hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HpacketTableComponent extends WidgetComponent {
  TIMESTAMP_DEFAULT_FIELD_NAME : string = "timestamp_default";
  TABLE_LIMIT = 400;
  callBackEnd = false;
  hPacketId: number;
  isPaused: boolean;
  @ViewChild('tableChild', {static: false}) tableChild;
  array: object[] = [];
  pRequest;
  tableSource: Subject<TableEvent> = new Subject<TableEvent>();
  timestamp = new Date();
  tableHeaders: TableHeader[] = [];
  totalLength = 0;
  allData = [];

  offlineDataSubscription: Subscription;

  constructor(
    public dataStreamService: DataStreamService,
    private dashboardOfflineDataService: DashboardOfflineDataService,
    private widgetsService: WidgetsService,
    private dateFormatterService: DateFormatterService
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
        if (!Array.isArray(value)) {
          // round to configured decimal digits
          value = (+value).toFixed(unitConversion.decimals);
        }
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
      this.tableHeaders = fieldIds.map(hPacketFieldId => ({
        value: this.widget.config.packetFields[hPacketFieldId],
        label: this.widget.config.fieldAliases[hPacketFieldId] || this.widget.config.packetFields[hPacketFieldId]
      }));
      this.tableHeaders.push({ value: this.widget.config.timestampFieldName });  // display timestamp too
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
      this.widgetAction.emit({ widget: this.widget, action: 'widget:ready'});
    }
    if (this.offlineDataSubscription) {
      this.offlineDataSubscription.unsubscribe();
    }
    this.offlineDataSubscription = this.dashboardOfflineDataService.getPacketDataSubject(this.hPacketId).subscribe(
      res => {
        this.totalLength = res;
        this.allData = [];
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
    return array.some(y => y.name === name) ? array.find(y => y.name === name).value : null;
  }

  dataRequest(lowerBound) {
    if (this.pRequest) {
      this.pRequest.unsubscribe();
    }
    this.pRequest = this.dashboardOfflineDataService.getData(this.hPacketId, "", lowerBound).subscribe(
      res => {
        res.forEach(a => {
          if (this.allData.length >= this.TABLE_LIMIT) {
            return;
          }
          const element = this.tableHeaders.map(x=>x.value).reduce((prev, curr) => { prev[curr] = this.getDatum(a.fields, curr); return prev; }, {});
          const timestampValue = this.getDatum(a.fields,a.timestampField);
          const timestampFieldName = this.widget.config.timestampFieldName;
          element[timestampFieldName] = this.dateFormatterService.formatTimestamp(timestampValue);
          if (this.widget.config.packetUnitsConversion)
            this.applyUnitConvertion(this.widget.config.packetUnitsConversion, element);
            this.allData.push(element);
        });
        this.tableSource.next({type:'DATA', values: this.allData});
        if (this.allData.length >= this.TABLE_LIMIT) {
          this.tableSource.next({type:'EVENT', event: 'LIMIT_REACHED'});
        }
        if (this.allData.length >= this.totalLength) {
          this.tableSource.next({type:'EVENT', event: 'DATA_END'});
        }

      },
      err => {
        console.log(err);
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
