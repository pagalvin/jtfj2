import { KnowledgeDomainItem } from '../KnowledgeDomains/KDItem';
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

  public async GetNodeStatus() {

    this.clog.info(`node-utils.service: GetNodeStatus: Entering.`);

    const apiEndPoint = "/api/status";
    
    this.clog.info(`node-utils.service: GetNodeStatus: Request status from node at ${apiEndPoint}.`);
    
    const pingResult = await this.httpService.get(apiEndPoint);

    pingResult.subscribe( (data) => {
      this.clog.info(`node-utils.service: GetNodeStatus: Got a response:, `, JSON.parse(data["_body"]));
    })

    
  }

  public async AddNewKnowledgeDomain() {

    const apiEndPoint = "/api/KnowledgeDomains/new";

    const newKD = new KnowledgeDomainItem();
    newKD.Description = "[body] Created by nodeutils.service, AddNewKnowledgeDomain().";
    newKD.Title = "[title] Created by nodeutils.service, AddNewKnowledgeDomain().";
    
    const postResult = await this.httpService.post(apiEndPoint, newKD);

    postResult.subscribe((data) => {
      this.clog.info(`node-utils.service: AddNewKnowledgeDomain: Got a response from posting:`, data);
    });

  }

  // router.post('/KnowledgeDomains/:kdID/update', (req, res) => {

  public async UpdateKnowledgeDomain() {

    const apiEndPoint = "/api/KnowledgeDomains/my unique id/update";

    const newKD = new KnowledgeDomainItem();
    newKD.Description = "[body] Updated " + new Date().toTimeString() + "by nodeutils.service, AddNewKnowledgeDomain().";
    newKD.Title = "[title] Updated " + new Date().toTimeString() + " by nodeutils.service, AddNewKnowledgeDomain().";

    const postResult = await this.httpService.post(apiEndPoint, newKD);

    postResult.subscribe((data) => {
      this.clog.info(`node-utils.service: UpdateKnowledgeDomain: Got a response from posting:`, data);
    });

  }

}
