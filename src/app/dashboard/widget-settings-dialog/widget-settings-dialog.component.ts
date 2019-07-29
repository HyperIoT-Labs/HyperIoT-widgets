import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HPacket, HPacketField, HpacketsService } from '@hyperiot/core';

@Component({
  selector: 'app-widget-settings-dialog',
  templateUrl: './widget-settings-dialog.component.html',
  styleUrls: ['./widget-settings-dialog.component.css']
})
export class WidgetSettingsDialogComponent implements OnInit, OnDestroy {
  @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();
  @Input() widget;
  private widgetId: string;

  @Input()
  selectedPacket: HPacket = null;
  selectedFields: HPacketField[] = [];
  projectPackets: HPacket[] = [];

  constructor(
    private viewContainer: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private packetService: HpacketsService
  ) {
    this.widgetId = this.activatedRoute.snapshot.paramMap.get('widgetId');
    // fetch all packets
    this.packetService
      .findAllHPacket()
      .subscribe((packetList) => this.projectPackets = packetList);
  }

  ngOnInit() {
    this.viewContainer.nativeElement
      .addEventListener('click', this.dismiss.bind(this));
    this.open();
  }

  ngOnDestroy() {
    this.viewContainer.nativeElement
      .removeEventListener('click', this.dismiss.bind(this));
  }

  packetCompare(p1: HPacket, p2: HPacket) {
    return p1 != null && p2 != null && p1.id === p2.id;
  }

  getWidgetId() {
    return this.widgetId;
  }

  setWidget(w: any) {
    this.widget = w;
    if (w.config && w.config.packetId) {
      this.packetService.findHPacket(w.config.packetId)
        .subscribe((packet: HPacket) => {
          this.selectedPacket = packet;
          if (this.widget.config.packetFields) {
            packet.fields.map((pf) => {
              if (this.widget.config.packetFields.indexOf(pf.name) !== -1) {
                this.selectedFields.push(pf);
              }
            });
          }
        });
    }
  }

  dismiss(e: any) {
    if (e.target === this.viewContainer.nativeElement) {
      this.close(e);
    }
    // TODO: the following is temporary code, just for testing
    console.log(this.widget);
    if (this.selectedPacket && this.selectedFields.length > 0) {
      this.widget.config.packetId = this.selectedPacket.id;
      this.widget.config.packetFields = [];
      this.selectedFields.map((pf) => this.widget.config.packetFields.push(pf.name));
    }
  }

  open() {
    // TODO: init stuff goes here
  }

  close($event) {
    this.router.navigate(
      ['../', { outlets: { modal: null } }],
      { relativeTo: this.activatedRoute }
    );
    this.modalClose.emit($event);
  }
}
