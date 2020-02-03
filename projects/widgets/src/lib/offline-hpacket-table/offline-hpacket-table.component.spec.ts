import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineHpacketTableComponent } from './offline-hpacket-table.component';

describe('OfflineHpacketTableComponent', () => {
  let component: OfflineHpacketTableComponent;
  let fixture: ComponentFixture<OfflineHpacketTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineHpacketTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHpacketTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
