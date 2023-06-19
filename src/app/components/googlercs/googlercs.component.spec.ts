import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglercsComponent } from './googlercs.component';

describe('GooglercsComponent', () => {
  let component: GooglercsComponent;
  let fixture: ComponentFixture<GooglercsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GooglercsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GooglercsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
