import { TestBed } from '@angular/core/testing';

import { BebidasApi } from './bebidas-api';

describe('BebidasApi', () => {
  let service: BebidasApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BebidasApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
