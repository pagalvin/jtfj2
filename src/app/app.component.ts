import { ViewDebugToggleComponent } from './Framework/view-debug-toggle-component/view-debug-toggle.component';
import { Component } from '@angular/core';
import { ViewDebugToggleService } from "./Framework/view-debug-toggle-component/view-debug-toggle.service";

@Component({
  selector: 'just-the-facts-jack',
  templateUrl: './JustTheFactsJack.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public get debugView() : boolean {return this.debugServicve.ViewDebugIsEnabled}
  
  constructor(private debugServicve: ViewDebugToggleService) {

  }

}
