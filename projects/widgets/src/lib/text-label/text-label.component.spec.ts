import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextLabelComponent } from './text-label.component';

describe('HelloWorldComponent', () => {
  let component: TextLabelComponent;
  let fixture: ComponentFixture<TextLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
