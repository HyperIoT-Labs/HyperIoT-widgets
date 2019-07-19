import { OnDestroy, Input } from '@angular/core';
import { PartialObserver } from 'rxjs';

import { DataChannel, DataStreamService } from '@hyperiot/core';

import { DataPacketFilter } from './data/data-packet-filter';

/**
 * Base class for widget implementation
 */
export abstract class WidgetComponent implements OnDestroy {
  protected dataChannel: DataChannel;
  /**
   * Widget configuration object (template-bindable)
   *
   * @example
   * this.widget = {
   *   // mandatory widget identifier field
   *   id: "widget-2",
   *   // follow other custom fields used by the widget (optional)
   *   config: { field1: "value1", field2: "value2", ... }
   * };
   */
  @Input()
  widget: any = {};

  /**
   * Contructor
   * @param dataStreamService Inject data stream service
   */
  constructor(public dataStreamService: DataStreamService) { }

  ngOnDestroy() {
    // clean up event and subject subscriptions
    this.unsubscribeRealTimeStream();
  }

  /**
   * Pause the real-time data stream
   */
  abstract pause(): void;

  /**
   * Resume the real-time data stream
   */
  abstract play(): void;

  /**
   * Get widget data in the specified date range
   *
   * @param startDate Data range start date
   * @param endDate Data range end date
   * @returns A futurable or the requested data
   */
  abstract getOfflineData(startDate: Date, endDate: Date): any;

  /**
   * Set the real-time data stream the widget will receive data from
   *
   * @param widgetId The widget id
   * @param packetFilter Packet id and data filters (only listed fields will be streamed to the widget)
   * @param observerCallback Callback to fire once new data is received
   */
  subscribeRealTimeStream(packetFilter: DataPacketFilter, observerCallback: PartialObserver<[any, any]> | any): void {
    this.unsubscribeRealTimeStream();
    this.dataChannel = this.dataStreamService.addDataStream(this.widget.widgetId, packetFilter);
    this.dataChannel.subject.subscribe(observerCallback);
  }

  /**
   * Stops receiving data from the subscribed data stream
   */
  unsubscribeRealTimeStream(): void {
    if (this.dataChannel != null) {
      // TODO: maybe move the unsubscription inside the DataStreamServiceid)l
      this.dataChannel.subject.unsubscribe();
      this.dataStreamService.removeDataChannel(this.widget.widgetId);
    }
  }
}
