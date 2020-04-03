import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourierChartComponent } from './fourier-chart.component';

describe('FourierChartComponent', () => {
  let component: FourierChartComponent;
  let fixture: ComponentFixture<FourierChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourierChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourierChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
