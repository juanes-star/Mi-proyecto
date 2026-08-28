import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MejoresBebidas } from './mejores-bebidas';

describe('MejoresBebidas', () => {
  let component: MejoresBebidas;
  let fixture: ComponentFixture<MejoresBebidas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MejoresBebidas],
    }).compileComponents();

    fixture = TestBed.createComponent(MejoresBebidas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
