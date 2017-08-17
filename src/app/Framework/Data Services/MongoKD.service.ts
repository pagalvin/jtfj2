
import { Functionals } from '../../Framework/Util/Functionals'; 
import { RecordIDsService } from "../../Framework/Data Services/RecordIDsService";
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { Injectable } from '@angular/core';
import { Util } from '../../Framework/Util/Util';
import { AbstractAngularService } from '../../Framework/Data Structures/AbstractAngularService'
import { Http } from '@angular/http';
import { KnowledgeDomainItem } from '../../Admin/KnowledgeDomains/KDItem';

"use strict";

@Injectable()
export class MongoKDService extends AbstractAngularService {

    constructor(
        private clog: ConsoleLog,
        private httpService: Http
    ) {

        super();

    }

    public ping() {
        console.debug(`MongoKDService: got a ping, pinging your right back.`);
    }

    public async getItems(): Promise<KnowledgeDomainItem[]> {

        this.clog.info(`MongoKDService: getItems: Entering.`);

        const apiEndPoint = "/api/KnowledgeDomains";

        return new Promise<KnowledgeDomainItem[]>((resolve, reject) => {

            this.httpService.get(apiEndPoint)
                .subscribe((results) => {

                    const parsedResults = JSON.parse(results["_body"]);

                    this.clog.info(`MongoKDService: getItems, got a result:`, parsedResults);

                    resolve(parsedResults.KnowledgeDomains.map( (aRawKD) => {
                        const result = new KnowledgeDomainItem();
                        result.Description = aRawKD.Description;
                        result.Title = aRawKD.Title;
                        result.UniqueID = aRawKD._id;
                        result.DateCreated = aRawKD.DateCreated;
                        result.DateModified = aRawKD.DateModified;
                        return result;
                    }));

                });
        })
    };

    public async createItem(itemToCreate: KnowledgeDomainItem): Promise<KnowledgeDomainItem> {

        this.clog.info(`MongoKD.service: createItem: Entering, item to create:`, itemToCreate);

        return new Promise<KnowledgeDomainItem>(async (resolve, reject) => {

            const apiEndPoint = "/api/KnowledgeDomains/new";

            this.clog.info(`MongoKD.service: createItem: About to post to Mongo.`);
            
            const postResult = this.httpService.post(apiEndPoint, itemToCreate);

            this.clog.info(`MongoKD.service: createItem: subscribing to post result.`);
            
            postResult.subscribe(
                (data) => {

                    this.clog.info(`MongoKD.service: createItem: got some raw data:`, data);

                    const parsedBody = JSON.parse(data["_body"]);

                    this.clog.info(`MongoKD.service: createItem: Got a response from posting:`, parsedBody);

                    const newKDItem = new KnowledgeDomainItem();
                    newKDItem.Description = itemToCreate.Description;
                    newKDItem.InternalID = itemToCreate.InternalID;
                    newKDItem.Title = itemToCreate.Description;
                    newKDItem.UniqueID = parsedBody.newItemID;
                    resolve (newKDItem);
                },
                (errorDetails) => {
                    this.clog.error(`MongoKDService: createItem: Failed to create the item, full details:`, errorDetails);
                    reject(errorDetails);
                }
            );
            
        });

    }

    public async updateItem(itemToUpdate: KnowledgeDomainItem): Promise<boolean> {

        const apiEndPoint = `/api/KnowledgeDomains/${itemToUpdate.UniqueID}/update`;

        const postResult = await this.httpService.post(apiEndPoint, itemToUpdate);

        return new Promise<boolean>((resolve, reject) => {

            postResult.subscribe((data) => {
                this.clog.info(`MongoKDService: updateItem: Got a response from posting:`, {alldata: data, parsedBody: JSON.parse(data["_body"])});
                resolve(true);
            });
        });

    }

    public async deleteItem(domainID: string): Promise<boolean> {

        const apiEndPoint = `/api/KnowledgeDomains/${domainID}/delete`;

        const postResult = await this.httpService.delete(apiEndPoint);

        return new Promise<boolean>((resolve, reject) => {

            postResult.subscribe((data) => {
                this.clog.info(`MongoKDService: deleteItem: Got a response from posting:`, 
                    {alldata: data, parsedBody: JSON.parse(data["_body"])});
                resolve(true);
            });
        });

    }

}
