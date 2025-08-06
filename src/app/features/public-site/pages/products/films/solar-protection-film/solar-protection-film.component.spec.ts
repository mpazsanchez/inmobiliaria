import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarProtectionFilmComponent } from './solar-protection-film.component';

describe('SolarProtectionFilmComponent', () => {
  let component: SolarProtectionFilmComponent;
  let fixture: ComponentFixture<SolarProtectionFilmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarProtectionFilmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarProtectionFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
