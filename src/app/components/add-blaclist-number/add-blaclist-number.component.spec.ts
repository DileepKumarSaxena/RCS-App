import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlaclistNumberComponent } from './add-blaclist-number.component';

describe('AddBlaclistNumberComponent', () => {
  let component: AddBlaclistNumberComponent;
  let fixture: ComponentFixture<AddBlaclistNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBlaclistNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBlaclistNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
