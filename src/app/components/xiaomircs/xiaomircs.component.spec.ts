import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XiaomircsComponent } from './xiaomircs.component';

describe('XiaomircsComponent', () => {
  let component: XiaomircsComponent;
  let fixture: ComponentFixture<XiaomircsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XiaomircsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XiaomircsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
