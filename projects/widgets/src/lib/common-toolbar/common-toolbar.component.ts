import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

@Component({
    selector: 'hyperiot-common-toolbar',
    templateUrl: './common-toolbar.component.html',
    styleUrls: [ './common-toolbar.component.css']
})
export class CommonToolbarComponent {
    @Input() config = {
        showClose: true,
        showSettings: true,
        showPlay: false,
        showRefresh: false,
        showTable: false
    }
    @Output() action = new EventEmitter<string>();
    isPaused: boolean;
    showTable: boolean;

    onPlayPause() {
        if (this.isPaused) {
            this.action.emit('play');
        } else {
            this.action.emit('pause');
        }
        this.isPaused = !this.isPaused;
    }
    onTableView() {
        if (this.showTable) {
            this.action.emit('chart');
        } else {
            this.action.emit('table');
        }
        this.showTable = !this.showTable;
    }
    onRefresh() {
        this.action.emit('refresh');
    }
    onSettings() {
        this.action.emit('settings');
    }
    onDrag() {
        this.action.emit('drag');
    }
    onClose() {
        this.action.emit('close');
    }
}
