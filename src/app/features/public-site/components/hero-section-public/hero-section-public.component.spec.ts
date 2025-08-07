import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSectionPublicComponent } from './hero-section-public.component';

describe('HeroSectionPublicComponent', () => {
  let component: HeroSectionPublicComponent;
  let fixture: ComponentFixture<HeroSectionPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSectionPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
