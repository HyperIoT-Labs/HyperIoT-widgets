import { OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit, ViewChild } from '@angular/core';
import { PartialObserver, Subscription } from 'rxjs';

import { DataChannel, DataStreamService, DataPacketFilter } from '@hyperiot/core';
import { CommonToolbarComponent } from './common-toolbar/common-toolbar.component';

/**
 * Base class for widget implementation
 */
export abstract class WidgetComponent implements OnDestroy, OnChanges, AfterContentInit {
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
  public widget: any = {};

  @Input()
  public data: any = '';

  @Input()
  public isModalView = false;

  dataSubscription: Subscription;

  // used to signal widget actions
  @Output() widgetAction: EventEmitter<any> = new EventEmitter();
  public isConfigured = false;

  @ViewChild('toolbar') toolbar: CommonToolbarComponent;

  /**
   * Contructor
   * @param dataStreamService Inject data stream service
   */
  constructor(public dataStreamService: DataStreamService) {
  }

  ngAfterContentInit() {
    this.configure();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.widget && changes.widget.currentValue) {
      changes.widget.currentValue.instance = this;
    }
  }

  ngOnDestroy() {
    // clean up event and subject subscriptions
    this.unsubscribeRealTimeStream();
  }

  /**
   * This method is called to apply the current
   * widget configuration.
   */
  protected configure(): void {
    this.isConfigured = true;
    // this.unsubscribeRealTimeStream();
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
   * Set the real-time data stream the widget will receive data from
   *
   * @param packetFilter Packet id and data filters (only listed fields will be streamed to the widget)
   * @param observerCallback Callback to fire once new data is received
   */
  subscribeRealTimeStream(packetFilter: DataPacketFilter, observerCallback: PartialObserver<[any, any]> | any): void {
    this.unsubscribeRealTimeStream();
    this.dataChannel = this.dataStreamService.addDataStream(this.widget.id, packetFilter);
    this.dataSubscription = this.dataChannel.subject.subscribe(observerCallback);
  }

  /**
   * Stops receiving data from the subscribed data stream
   */
  unsubscribeRealTimeStream(): void {
    if (this.dataChannel != null) {
      // TODO: maybe move the unsubscription inside the DataStreamServiceid)l
      this.dataSubscription.unsubscribe();
      this.dataStreamService.removeDataChannel(this.widget.id);
    }
  }

  /**
   * This method is invoked by the dashboard, which tells to all widget it contains that data streamed must be played or not
   * @param play Whether the widget has to display data or not
   */
  onDashboardPlay(play: boolean) {
    this.toolbar.play(play);
  }

}
