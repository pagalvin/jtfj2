import { Injectable } from '@angular/core';
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { Http } from '@angular/http';

@Injectable()
export class NodeUtilsService {

  constructor(
    private httpService: Http,
    private clog: ConsoleLog
  ) { }


  public async PingNode() {

    this.clog.info(`node-utils.service: PingNode: Entering.`);

    const apiEndPoint = "/api/ping";
    
    this.clog.info(`node-utils.service: PingNode: Ping node at ${apiEndPoint}.`);
    
    const pingResult = await this.httpService.get(apiEndPoint);

    pingResult.subscribe( (data) => {
      this.clog.info(`node-utils.service: PingNode: Got a response:, `, data);
    })

  }

}
