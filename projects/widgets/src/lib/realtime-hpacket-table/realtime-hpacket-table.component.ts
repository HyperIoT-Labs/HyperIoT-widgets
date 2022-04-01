import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataPacketFilter, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { DateFormatterService } from '../util/date-formatter.service';
import { WidgetMultiValueComponent } from '../widget-multi-value.component';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-realtime-hpacket-table',
  templateUrl: './realtime-hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './realtime-hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RealtimeHPacketTableComponent extends WidgetMultiValueComponent {

  callBackEnd = false;
  hPacketId: number;
  isPaused: boolean;
  DEFAULT_MAX_TABLE_LINES = 50;
  @ViewChild('tableChild') tableChild;
  tableSource: Subject<any[]> = new Subject<any[]>();
  array: object[] = [];
  timestamp = new Date();
  tableHeaders = [];
  totalLength = 0;

  offlineDataSubscription: Subscription;

  constructor(
    public dataStreamService: DataStreamService,
    public dataStreamServiceModal: DataStreamService,
    private dateFormatterService: DateFormatterService
  ) {
    super(dataStreamService, dataStreamServiceModal);
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

    this.hPacketId = this.widget.config.packetId;
    const dataPacketFilter = new DataPacketFilter(this.hPacketId, this.widget.config.packetFields, true);
    this.subscribeDataStream(dataPacketFilter);
    // refresh rate default 1 sec
    this.startRefreshTask(this.widget.config.refreshIntervalMillis?this.widget.config.refreshIntervalMillis:1000);
  }

  private subscribeDataStream(dataPacketFilter: DataPacketFilter): void {
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      if (this.isPaused) {
        return;
      }
      let fields = eventData[1];
      fields[this.widget.config.timestampFieldName] = this.dateFormatterService.formatDate(eventData[0]);
      this.push(fields);
    });
  }

  protected renderData() {
    const maxTableLines = this.widget.config.maxLogLines ? this.widget.config.maxLogLines : this.DEFAULT_MAX_TABLE_LINES;
    let bufferedValues : Object[] = this.pop();
    if(bufferedValues.length > 0){
      bufferedValues.forEach(val =>{
        this.array.push(val);
      })
      if (this.array.length > maxTableLines) {
        let dif = this.array.length - maxTableLines;
        //removing surplus data
        this.array.splice(0,dif);
      }
      this.tableChild.resetTable(this.array.length, false);
    }
  }

  onToolbarAction(action: string) {
    switch (action) {
      case 'toolbar:play':
        this.play();
        break;
      case 'toolbar:pause':
        this.pause();
        break;
    }
    this.widgetAction.emit({ widget: this.widget, action });
  }

  pageRequest(rowsIndexes) {
    this.tableSource.next(this.array.slice(rowsIndexes[0], rowsIndexes[1]));
  }

  play(): void {
    this.isPaused = false;
  }

  pause(): void {
    this.isPaused = true;
  }

}
