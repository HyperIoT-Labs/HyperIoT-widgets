import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataStreamService, DataPacketFilter } from '@hyperiot/core';
import { WidgetsService } from '../widgets.service';
import { WidgetComponent } from '../widget.component';

@Component({
  selector: 'hyperiot-image-data',
  templateUrl: './image-data.component.html',
  styleUrls: ['./image-data.component.scss']
})
export class ImageDataComponent extends WidgetComponent implements OnInit {
  timestamp = new Date();
  isActivityLedOn = false;
  dataUrl: any;

  callBackEnd = false;

  private ledTimeout: any = null;

  constructor(
    public dataStreamService: DataStreamService,
    public dataStreamServiceModal: DataStreamService,
    private widgetsService: WidgetsService,
    private sanitizer: DomSanitizer
  ) {
    super(dataStreamService, dataStreamServiceModal);
  }

  pause(): void {
    throw new Error('Method not implemented.');
  }
  play(): void {
    throw new Error('Method not implemented.');
  }

  onToolbarAction(action: string) {
    this.widgetAction.emit({ widget: this.widget, action });
  }

  ngOnInit(): void {
  }

  configure() {
    super.configure();
    if (!(this.widget.config != null
      && this.widget.config.packetId != null
      && this.widget.config.packetFields != null
      && Object.keys(this.widget.config.packetFields).length > 0)) {
      this.isConfigured = false;
      this.callBackEnd = true;
      return;
    }

    // Set Callback End
    this.callBackEnd = true;

    // subscribe data stream
    const cfg = this.widget.config;
    const dataPacketFilter = new DataPacketFilter(cfg.packetId, cfg.packetFields);
    this.subscribeRealTimeStream(dataPacketFilter, (eventData) => {
      this.timestamp = eventData[0];
      const field = eventData[1];
      this.blinkLed();
      // get the sensor field name and value
      const fieldIds = Object.keys(cfg.packetFields);
      if (fieldIds.length > 0) {
        const name = cfg.packetFields[fieldIds[0]];
        const imageData: number[] = field[name].map(v => {
          // value might be an object with one field with the type name (eg. {double: 22.2})
          const keys = Object.keys(v);
          return keys.length > 0 ? v[keys[0]] : v;
        });
        this.drawImage(cfg.imageWidth, cfg.imageHeight, imageData);
      }
    });
  }

  blinkLed() {
    this.isActivityLedOn = true;
    if (this.ledTimeout != null) {
      clearTimeout(this.ledTimeout);
      this.ledTimeout = null;
    }
    this.ledTimeout = setTimeout(() => this.isActivityLedOn = false, 100);
  }

  private drawImage(w: number, h: number, data: number[]) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
          const pixel = data[(w*y)+x];
          const v = ((pixel - min) / range) * 255;
          //const v = pixel;
          ctx.fillStyle = `rgb(${v}, ${v}, ${v})`;
          ctx.fillRect(x, y, 1, 1);

        }
    }
    this.dataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(canvas.toDataURL());
  }
}
