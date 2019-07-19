import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';

import { HPacket, HpacketsService, HPacketField } from '@hyperiot/core';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit, OnDestroy {
  selectedWidget: {id: number, name: string} = null;
  selectedPacket: HPacket = null;
  selectedFields: HPacketField[] = [];
  widgetList = [
    { id: 1, name: 'Pie chart', category: '', size: { rows: 0, cols: 0 } },
    { id: 2, name: 'Line chart', category: '' },
    { id: 3, name: 'Bar chart', category: '' },
    { id: 4, name: 'Sensor value', category: '' },
    { id: 5, name: 'Simple text', category: '' }
  ];
  projectPackets: HPacket[] = [];

  constructor(
    private viewContainer: ElementRef,
    private packetService: HpacketsService
  ) { }

  ngOnInit() {
    this.viewContainer.nativeElement.addEventListener('click', this.dismiss.bind(this));
    this.packetService
        .findAllHPacket_1()
        .subscribe((packetList) => this.projectPackets = packetList);
    this.close();
  }
  ngOnDestroy() {
    this.viewContainer.nativeElement.removeEventListener('click', this.dismiss.bind(this));
  }

  open() {
    this.viewContainer.nativeElement.style.display = '';
  }

  close() {
    this.viewContainer.nativeElement.style.display = 'none';
  }

  dismiss(e: any) {
    if (e.target === this.viewContainer.nativeElement) {
      this.close();
    }
  }

  confirm() {
    console.log(this.selectedWidget);
    console.log(this.selectedPacket);
    console.log(this.selectedFields);
    // TODO: add widget
  }

}
