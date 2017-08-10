import { Component, OnInit } from '@angular/core';

import { NodeUtilsService } from './node-utils.service';

import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';

@Component({
  selector: 'app-node-utils',
  templateUrl: './node-utils.component.html',
  styleUrls: ['./node-utils.component.css']
})
export class NodeUtilsComponent implements OnInit {

  constructor(
    private nodeUtilsService: NodeUtilsService,
    private clog: ConsoleLog) { }

  ngOnInit() {
  }

  public PingNode() {

    this.clog.info(`node-utils.component: PingNode: Entering.`);

    this.nodeUtilsService.PingNode();
    
  }
}
