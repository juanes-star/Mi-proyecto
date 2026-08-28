import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MejoresComida } from './mejores-comida';

describe('MejoresComida', () => {
  let component: MejoresComida;
  let fixture: ComponentFixture<MejoresComida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MejoresComida],
    }).compileComponents();

    fixture = TestBed.createComponent(MejoresComida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
