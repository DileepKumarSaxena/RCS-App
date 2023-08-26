import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlaclistNumberComponent } from './blaclist-number.component';

describe('BlaclistNumberComponent', () => {
  let component: BlaclistNumberComponent;
  let fixture: ComponentFixture<BlaclistNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlaclistNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlaclistNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
