import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartPopoverComponent } from './cart-popover.component';

describe('CartPopoverComponent', () => {
  let component: CartPopoverComponent;
  let fixture: ComponentFixture<CartPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPopoverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
