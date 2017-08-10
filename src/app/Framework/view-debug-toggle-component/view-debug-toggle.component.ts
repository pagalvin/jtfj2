import { Component, OnInit } from '@angular/core';
import { ViewDebugToggleService } from './view-debug-toggle.service';
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';

@Component({
  selector: 'jtfj-view-debug-toggle-component',
  templateUrl: './view-debug-toggle.component.html',
  styleUrls: ['./view-debug-toggle.component.css']
})
export class ViewDebugToggleComponent implements OnInit {

  public get debugViewIsEnabled() { return this.debugService.ViewDebugIsEnabled}
  
  constructor(private debugService: ViewDebugToggleService,
    private clog: ConsoleLog) { }

  ngOnInit() {
  }

  public ToggleDebugIsEnabled() {
    
    this.clog.debug(`view-debug-toggle.component: ToggleDebugIsEnabled: setting a debug status:`, this.debugService);
    this.debugService.ViewDebugIsEnabled = ! this.debugService.ViewDebugIsEnabled;
  }
}
