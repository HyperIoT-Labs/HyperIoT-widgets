import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeHPacketTableComponent } from './realtime-hpacket-table.component';

describe('RealtimeHPacketTableComponent', () => {
  let component: RealtimeHPacketTableComponent;
  let fixture: ComponentFixture<RealtimeHPacketTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeHPacketTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeHPacketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
