// This service is meant to be injected into components that want to enable/disable global view debugging.
import { Injectable } from '@angular/core';

@Injectable()
export class ViewDebugToggleService {

  public ViewDebugIsEnabled: boolean = false;

  constructor() { }

}
