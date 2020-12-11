import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AlgorithmOfflineDataService, DataStreamService } from '@hyperiot/core';
import { Subject } from 'rxjs';
import { WidgetComponent } from '../widget.component';
import * as moment from 'moment';

@Component({
  selector: 'hyperiot-algorithm-table',
  templateUrl: './algorithm-table.component.html',
  styleUrls: ['../../../../../src/assets/widgets/styles/widget-commons.css', './algorithm-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlgorithmTableComponent extends WidgetComponent {

  callBackEnd = false;
  algorithmId: number;
  isPaused: boolean;
  DEFAULT_MAX_TABLE_LINES = 1000;
  @ViewChild('tableChild', {static: false}) tableChild;
  array: object[] = [];
  pRequest;
  tableSource: Subject<any[]> = new Subject<any[]>();
  tableHeaders = [];
  totalLength = 1;

  constructor(
    public dataStreamService: DataStreamService,
    private algorithmOfflineDataServices: AlgorithmOfflineDataService
  ) {
    super(dataStreamService);
  }

  configure() {
    super.configure();
    if (!(this.widget.config != null
        && this.widget.config.algorithmId != null
        && this.widget.config.outputFields.length > 0)) {
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
    const outputFields: string[] = this.widget.config.outputFields;
    if (outputFields.length > 0) {
      this.tableHeaders = [];
      outputFields.forEach(outputField => this.tableHeaders.push(outputField));
    }

    // set data source
    this.setDatasource();
  }

  private setDatasource(): void {
    if (this.algorithmId !== this.widget.config.algorithmId) {
      if (this.algorithmId) {
        this.algorithmOfflineDataServices.removeWidget(this.widget.id, this.algorithmId);
      }
      this.algorithmId = this.widget.config.algorithmId;
      this.algorithmOfflineDataServices.addWidget(this.widget.id, this.algorithmId);
    }
    setTimeout(() => {
      // first load
      this.tableChild.resetTable(this.totalLength, true);
    }, 0);
    setInterval(() => {
      // load updated data every hour
      this.tableChild.resetTable(this.totalLength, true);
    }, 60*60*1000);
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
        this.algorithmOfflineDataServices.removeWidget(this.widget.id, this.algorithmId);
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
    this.pRequest = this.algorithmOfflineDataServices.getData(this.algorithmId).subscribe(
      res => {
        const pageData = [];
        const rowKey = Object.keys(res.rows)[0];  // take only first value
        const value = res.rows[rowKey].value;
        const millis = +value.timestamp * 1000;
        value.timestamp = moment(millis).format('L') + ' ' + moment(millis).format('LTS');
        this.tableHeaders = Object.keys(value);
        pageData.push(value);
        this.tableSource.next(pageData);
      },
      err => {
        // TODO send error to table
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
