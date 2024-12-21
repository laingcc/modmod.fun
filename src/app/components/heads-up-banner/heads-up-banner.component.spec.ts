import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadsUpBannerComponent } from './heads-up-banner.component';

describe('HeadsUpBannerComponent', () => {
  let component: HeadsUpBannerComponent;
  let fixture: ComponentFixture<HeadsUpBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadsUpBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeadsUpBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
