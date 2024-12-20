import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThreadModalComponent } from './create-thread-modal.component';

describe('CreateThreadModalComponent', () => {
  let component: CreateThreadModalComponent;
  let fixture: ComponentFixture<CreateThreadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateThreadModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateThreadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
