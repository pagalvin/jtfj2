import { TestBed, inject } from '@angular/core/testing';

import { NodeUtilsService } from './node-utils.service';

describe('NodeUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodeUtilsService]
    });
  });

  it('should be created', inject([NodeUtilsService], (service: NodeUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
