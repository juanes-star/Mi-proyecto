import { TestBed } from '@angular/core/testing';

import { ComidaApi } from './comida-api';

describe('ComidaApi', () => {
  let service: ComidaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComidaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
