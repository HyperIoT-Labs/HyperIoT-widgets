import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeValueComponent } from './gauge-value.component';

describe('GaugeValueComponent', () => {
  let component: GaugeValueComponent;
  let fixture: ComponentFixture<GaugeValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
