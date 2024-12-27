import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripcodePillComponent } from './tripcode-pill.component';

describe('TripcodePillComponent', () => {
  let component: TripcodePillComponent;
  let fixture: ComponentFixture<TripcodePillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripcodePillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripcodePillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
