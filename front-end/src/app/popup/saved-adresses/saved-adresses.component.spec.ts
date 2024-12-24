import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedAdressesComponent } from './saved-adresses.component';

describe('SavedAdressesComponent', () => {
  let component: SavedAdressesComponent;
  let fixture: ComponentFixture<SavedAdressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedAdressesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedAdressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
