import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionInicio } from './informacion-inicio';

describe('InformacionInicio', () => {
  let component: InformacionInicio;
  let fixture: ComponentFixture<InformacionInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionInicio],
    }).compileComponents();

    fixture = TestBed.createComponent(InformacionInicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
