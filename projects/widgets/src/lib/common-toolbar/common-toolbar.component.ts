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
            this.action.emit('toolbar:play');
        } else {
            this.action.emit('toolbar:pause');
        }
        this.isPaused = !this.isPaused;
    }
    onTableView() {
        if (this.showTable) {
            this.action.emit('toolbar:chart');
        } else {
            this.action.emit('toolbar:table');
        }
        this.showTable = !this.showTable;
    }
    onRefresh() {
        this.action.emit('toolbar:refresh');
    }
    onSettings() {
        this.action.emit('toolbar:settings');
    }
    onDrag() {
        this.action.emit('toolbar:drag');
    }
    onClose() {
        this.action.emit('toolbar:close');
    }
}
