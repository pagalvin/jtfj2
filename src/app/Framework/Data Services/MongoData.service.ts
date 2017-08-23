import { IEntityMetadata } from '../Data Structures/IEntityMetadata';
import { Functionals } from '../../Framework/Util/Functionals';
import { RecordIDsService } from "../../Framework/Data Services/RecordIDsService";
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { Injectable } from '@angular/core';
import { Util } from '../../Framework/Util/Util';
import { AbstractAngularService } from '../../Framework/Data Structures/AbstractAngularService'
import { Http } from '@angular/http';
import { KnowledgeDomainItem } from '../../Admin/KnowledgeDomains/KDItem';
import { IAbstractItem } from '../../Framework/Data Structures/AbstractItem';

"use strict";

@Injectable()
export class MongoService extends AbstractAngularService {

    constructor(
        private clog: ConsoleLog,
        private httpService: Http
    ) {

        super();

    }

    public ping() {
        console.debug(`MongoService: got a ping, pinging your right back.`);
    }

    public async getItems(): Promise<KnowledgeDomainItem[]> {

        this.clog.info(`MongoService: getItems: Entering.`);

        const apiEndPoint = "/api/KnowledgeDomains";

        return new Promise<KnowledgeDomainItem[]>((resolve, reject) => {

            this.httpService.get(apiEndPoint)
                .subscribe((results) => {

                    const parsedResults = JSON.parse(results["_body"]);

                    this.clog.info(`MongoService: getItems, got a result:`, parsedResults);

                    resolve(parsedResults.Items.map((aRawKD) => {
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

    
    public loadAllItems<T extends IAbstractItem>(emd: IEntityMetadata): Promise<T[]> {

        return new Promise<T[]> (async (resolve, reject) => {
            
            const allMongoItems = await this.getAllItemsG(emd);
            
            resolve(<T[]>allMongoItems);

        });

    }

    public async getAllItemsG<T extends IAbstractItem>(md: IEntityMetadata): Promise<T[]> {

        return new Promise<T[]>((resolve, reject) => {

            const ll = `MongoService.getAllItems<${md.ConsoleLoggingLabel}>:`; // ll = logging label

            this.clog.info(`${ll} Entering.`);

            const apiEndPoint = `/api/${md.ApiRouteBaseName}s`; // pluralized for "get all"

            this.httpService.get(apiEndPoint).subscribe(
                (apiResult) => {

                    const parsedResults = JSON.parse(apiResult["_body"]);

                    this.clog.info(`${ll} got a result, _body:`, parsedResults);

                    // const entityResults: T[] = parsedResults[md.MongoCollectionName];
                    const entityResults: T[] = parsedResults.Items;

                    this.clog.info(`${ll} entity results:`, entityResults);

                    const allParsedItems = entityResults.map((aMongoRow) => {

                        const mappedResult = md.PropertyNames.reduce((prev, curr) => {
                            prev[curr] = aMongoRow[curr];
                            return prev;
                        }, <T>md.EmptyItem())

                        return mappedResult;

                    });

                    this.clog.info(`${ll} all parsed items:`, allParsedItems);

                    resolve(allParsedItems);
                });
        })
    };

    public async createItemG<T extends IAbstractItem>(itemToCreate: T): Promise<T> {

        this.clog.info(`MongoKD.service<${itemToCreate.EntityMetadata().ConsoleLoggingLabel}>: createItem: Entering, item to create:`, itemToCreate);

        return new Promise<T>(async (resolve, reject) => {

            const md = itemToCreate.EntityMetadata(); // md = metadata
            const ll = `MongoKD.service: createItemG<${md.ConsoleLoggingLabel}>:`; // ll = logging label

            const apiEndPoint = `/api/${md.ApiRouteBaseName}/new`;

            this.clog.info(`${ll} createItem: About to post to Mongo.`);

            const postResult = this.httpService.post(apiEndPoint, itemToCreate);

            this.clog.info(`${ll} createItem: subscribing to post result.`);

            postResult.subscribe(
                (data) => {

                    this.clog.info(`${ll} createItem: got some raw data:`, data);

                    const parsedBody = JSON.parse(data["_body"]);

                    this.clog.info(`${ll} createItem: Got a response from posting:`, parsedBody);

                    const resultItem = <T>itemToCreate.EntityMetadata().EmptyItem();
                    md.PropertyNames.forEach((aFieldName) => {
                        resultItem[aFieldName] = itemToCreate[aFieldName];
                    })
                    resultItem.UniqueID = parsedBody.newItemID;

                    resolve(resultItem);

                },
                (errorDetails) => {
                    this.clog.error(`${ll} Failed to create the item, full details:`, errorDetails);
                    reject(errorDetails);
                }
            );

        });

    }

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
                    resolve(newKDItem);
                },
                (errorDetails) => {
                    this.clog.error(`MongoService: createItem: Failed to create the item, full details:`, errorDetails);
                    reject(errorDetails);
                }
            );

        });

    }

    public async updateItemG<T extends IAbstractItem>(itemToUpdate: T): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {

            const md = itemToUpdate.EntityMetadata(); // md = metadata
            const ll = `MongService: updateItem<${md.ConsoleLoggingLabel}>:`; // ll = logging label

            const apiEndPoint = `/api/${md.ApiRouteBaseName}/${itemToUpdate.UniqueID}/update`;

            this.clog.info(`${ll} Entering, about to post item to Mongo.`, itemToUpdate);

            const postResult = this.httpService.post(apiEndPoint, itemToUpdate);

            postResult.subscribe((data) => {
                this.clog.info(`${ll} Got a response from posting:`, { alldata: data, parsedBody: JSON.parse(data["_body"]) });
                resolve(true);
            });
        });

    }


    public async updateItem(itemToUpdate: KnowledgeDomainItem): Promise<boolean> {

        const apiEndPoint = `/api/KnowledgeDomains/${itemToUpdate.UniqueID}/update`;

        const postResult = await this.httpService.post(apiEndPoint, itemToUpdate);

        return new Promise<boolean>((resolve, reject) => {

            postResult.subscribe((data) => {
                this.clog.info(`MongoService: updateItem: Got a response from posting:`, { alldata: data, parsedBody: JSON.parse(data["_body"]) });
                resolve(true);
            });
        });

    }

    public async deleteItemG<T extends IAbstractItem>(itemToDelete: T): Promise<boolean> {

        return new Promise<boolean>( async (resolve, reject) => {

            const md = itemToDelete.EntityMetadata(); // md = metadata
            const ll = `MongService: deleteItem<${md.ConsoleLoggingLabel}>:`; // ll = logging label

            const apiEndPoint = `/api/${md.ApiRouteBaseName}/${itemToDelete.UniqueID}/delete`;

            this.clog.info(`${ll} About to issue delete command.`);

            const postResult = this.httpService.delete(apiEndPoint);

            postResult.subscribe((data) => {
                this.clog.info(`${ll} Got a response from posting:`,
                    { alldata: data, parsedBody: JSON.parse(data["_body"]) });
                resolve(true);
            });
        });

    }


    public async deleteItem(domainID: string): Promise<boolean> {

        const apiEndPoint = `/api/KnowledgeDomains/${domainID}/delete`;

        const postResult = await this.httpService.delete(apiEndPoint);

        return new Promise<boolean>((resolve, reject) => {

            postResult.subscribe((data) => {
                this.clog.info(`MongoService: deleteItem: Got a response from posting:`,
                    { alldata: data, parsedBody: JSON.parse(data["_body"]) });
                resolve(true);
            });
        });

    }

}
