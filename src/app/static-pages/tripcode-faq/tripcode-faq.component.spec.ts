import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripcodeFaqComponent } from './tripcode-faq.component';

describe('TripcodeFaqComponent', () => {
  let component: TripcodeFaqComponent;
  let fixture: ComponentFixture<TripcodeFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripcodeFaqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripcodeFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
