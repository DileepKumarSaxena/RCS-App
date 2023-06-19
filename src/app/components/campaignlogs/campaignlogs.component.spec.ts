import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignlogsComponent } from './campaignlogs.component';

describe('CampaignlogsComponent', () => {
  let component: CampaignlogsComponent;
  let fixture: ComponentFixture<CampaignlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignlogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
