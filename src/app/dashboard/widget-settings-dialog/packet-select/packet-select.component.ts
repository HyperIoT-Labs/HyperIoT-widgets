import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

import { HPacket, HPacketField, HpacketsService } from '@hyperiot/core';

@Component({
  selector: 'app-packet-select',
  templateUrl: './packet-select.component.html',
  styleUrls: ['./packet-select.component.css'],
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class PacketSelectComponent implements OnInit {
  @Input() widget;
  @Input()
  selectedPacket: HPacket = null;
  selectedFields: HPacketField[] = [];
  projectPackets: HPacket[] = [];
  @Input()
  multiPacketSelect: false;

  constructor(private packetService: HpacketsService, public settingsForm: NgForm) {
    this.multiPacketSelect = this.multiPacketSelect || false;
  }

  ngOnInit() {
    this.loadPackets();
  }

  onPacketChange() {
    this.selectedFields = [];
  }

  apply() {
    if (this.selectedPacket) {
      this.widget.config.packetId = this.selectedPacket.id;
      this.widget.config.packetFields = [];
      this.selectedFields.map((pf) => this.widget.config.packetFields.push(pf.name));
    }
  }

  packetCompare(p1: HPacket, p2: HPacket) {
    return p1 != null && p2 != null && p1.id === p2.id;
  }

  loadPackets() {
    // fetch all packets
    this.packetService
      .findAllHPacket()
      .subscribe((packetList) => {
        this.projectPackets = packetList;
        const w = this.widget;
        // load curent packet data and set selected fields
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
      });
  }

}
