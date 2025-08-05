import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsTestimonialsComponent } from './clients-testimonials.component';

describe('ClientsTestimonialsComponent', () => {
  let component: ClientsTestimonialsComponent;
  let fixture: ComponentFixture<ClientsTestimonialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsTestimonialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
