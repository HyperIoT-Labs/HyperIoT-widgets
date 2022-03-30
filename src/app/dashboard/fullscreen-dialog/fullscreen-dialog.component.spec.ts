import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenDialogComponent } from './fullscreen-dialog.component';

describe('FullscreenDialogComponent', () => {
  let component: FullscreenDialogComponent;
  let fixture: ComponentFixture<FullscreenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullscreenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
