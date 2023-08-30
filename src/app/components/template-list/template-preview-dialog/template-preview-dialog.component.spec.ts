import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePreviewDialogComponent } from './template-preview-dialog.component';

describe('TemplatePreviewDialogComponent', () => {
  let component: TemplatePreviewDialogComponent;
  let fixture: ComponentFixture<TemplatePreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatePreviewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplatePreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
