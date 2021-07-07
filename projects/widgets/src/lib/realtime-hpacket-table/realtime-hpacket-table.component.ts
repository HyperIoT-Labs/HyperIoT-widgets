import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataPacketFilter, DataStreamService } from '@hyperiot/core';
import { Subject, Subscription } from 'rxjs';
import { DateFormatterService } from '../util/date-formatter.service';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-realtime-hpacket-table',
  templateUrl: './realtime-hpacket-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './realtime-hpacket-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RealtimeHPacketTableComponent extends WidgetComponent {

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
    private dateFormatterService: DateFormatterService
  ) {
    super(dataStreamService);
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
    this.hPacketId = this.widget.config.packetId;
    // subscribe data stream
    
    // todo remove below comments
    // let fields = this.widget.config.packetFields
    // fields[0] = this.widget.config.timestampFieldName;
    // const dataPacketFilter = new DataPacketFilter(this.hPacketId, fields, true);
    const dataPacketFilter = new DataPacketFilter(this.hPacketId, this.widget.config.packetFields, true);
    this.subscribeDataStream(dataPacketFilter);

  }

  private subscribeDataStream(dataPacketFilter: DataPacketFilter): void {
    const maxTableLines = this.widget.config.maxLogLines ? this.widget.config.maxLogLines : this.DEFAULT_MAX_TABLE_LINES;
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      if (this.isPaused) {
        return;
      }
      let fields = eventData[1];
      fields[this.widget.config.timestampFieldName] = this.dateFormatterService.formatDate(eventData[0]);
      this.array.unshift(fields);
      if (this.array.length > maxTableLines) {
        this.array.pop();
      }
      this.tableChild.resetTable(this.array.length, false);
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
