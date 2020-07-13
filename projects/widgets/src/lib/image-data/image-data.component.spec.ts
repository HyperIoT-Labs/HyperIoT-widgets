import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDataComponent } from './image-data.component';

describe('ImageDataComponent', () => {
  let component: ImageDataComponent;
  let fixture: ComponentFixture<ImageDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
