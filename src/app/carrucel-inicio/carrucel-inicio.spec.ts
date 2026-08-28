import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrucelInicio } from './carrucel-inicio';

describe('CarrucelInicio', () => {
  let component: CarrucelInicio;
  let fixture: ComponentFixture<CarrucelInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrucelInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrucelInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
