
import { Functionals } from '../../Framework/Util/Functionals'; 
import { RecordIDsService } from "../../Framework/Data Services/RecordIDsService";
import { KnowledgeDomainItem } from "./KDItem";
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { Injectable } from '@angular/core';
import { Util } from '../../Framework/Util/Util';
import { AbstractAngularService } from '../../Framework/Data Structures/AbstractAngularService'
import { MongoKDService } from '../../Framework/Data Services/MongoKD.service';

"use strict";

@Injectable()
export class KnowledgeDomainsService extends AbstractAngularService {

    private _allKnowledgeDomains: KnowledgeDomainItem[];
    public get AllKnowledgeDomains() { return this._allKnowledgeDomains; }

    private kdLoadPromise: Promise<KnowledgeDomainItem[]>;

    constructor(private _recordIDsService: RecordIDsService,
        private clog: ConsoleLog,
        private mongoKDService: MongoKDService
    ) {

        super();
        this.kdLoadPromise = this.loadAllKnowledgeDomains();

    }

    public ping() {
        console.debug(`KnowledgeDomainsService: got a ping, pinging your right back.`);
        this.kdLoadPromise = this.loadAllKnowledgeDomains();
    }

    public getKnowledgeDomains() {
        return this.loadAllKnowledgeDomains();
    }

    public async getKnowledgeDomainsByTitles(titles: string[]): Promise<KnowledgeDomainItem[]> {

        this.clog.debug(`KD.Service: getKnowledgeDomainsByTitles: Entering, looking up titles:`, titles);

        return new Promise<KnowledgeDomainItem[]>(async (resolve, reject) => {

            this.clog.debug(`KD.Service: getKnowledgeDomainsByTitles: awaiting KD Load promise.`);
            
            await this.kdLoadPromise;

            this.clog.debug(`KD.Service: getKnowledgeDomainsByTitles: all knowledge domains:`, this._allKnowledgeDomains);
            

            const result = titles.reduce((prev: KnowledgeDomainItem[], curr: string) => {

                const foundKD = this._allKnowledgeDomains.filter((aKD) => { return aKD.Title === curr })[0];

                prev = prev.concat(foundKD);

                return prev;
            }, []);

            this.clog.debug(`KD.Service: getKnowledgeDomainsByTitles: resolving with domains:`, result);
            
            resolve(result);
        });
    }

    public async getKnowledgeDomainItemByID(theId: string): Promise<KnowledgeDomainItem>{

        return new Promise<KnowledgeDomainItem>( (resolve, reject) => {
            this.kdLoadPromise.then( 
                (promiseResult) => {
                    console.debug(`KD.Service: Loaded all knowledge domains:`, this._allKnowledgeDomains);
                    try {
                        const result = Functionals.getEntityByUniqueID<KnowledgeDomainItem>(theId, this._allKnowledgeDomains);
                        resolve(result);
                    }
                    catch (getException) {
                        reject(getException);
                    }
            },
            (errorDetails) => {
                reject(errorDetails);
            }
        )
        });

    }

    private async persistKnowledgeDomains(): Promise<boolean> {

        return new Promise<boolean>( (resolve, reject) => {
            this.clog.debug(`KD.Service: _persistKnowledgeDomains: About to save to local storage, waiting 4 secs first.`);
            this.clog.debug(`KD.Service: _persistKnowledgeDomains: Saving to local storage, data:`, this._allKnowledgeDomains);
        
            localStorage.setItem("knowledgedomains", JSON.stringify(this._allKnowledgeDomains));
            resolve(true);
        });
    
    }

    public async deleteKnowledgeDomainByID(theDomainID: string): Promise<boolean> {
        
        return new Promise<boolean>( async (resolve, rejectO) => {

            this.clog.info(`KD.Service: deleteKowledgeDomainByID: Entering. Awaiting mongoKDService.deleteItem().`);

            const deleteResult = await this.mongoKDService.deleteItem(theDomainID);

            this.clog.info(`KD.Service: deleteKowledgeDomainByID: Item successfully deleted, updating all KDs.`);
            
            this._allKnowledgeDomains = Functionals.filterOutEntityByUniqueID(theDomainID, this._allKnowledgeDomains);
            
            resolve(true);
        })
    }

    public async saveKnowledgeDomain(kdToSave: KnowledgeDomainItem) {

        this.clog.debug(`KnowledgeDomainService: saveKnowledgeDomain: Entering, will save a domain:`, { dmn: kdToSave });
        this.clog.debug(`KnowledgeDomainService: saveKnowledgeDomain: is id assigned?:`, Functionals.isIDAssigned(kdToSave));

        if (! Functionals.isIDAssigned(kdToSave)) {

            this.clog.debug(`KnowledgeDomainService: saveKnowledgeDomain: No ID assigned, will create a new record on the mongo side.`);

            const savedDomain = await this.mongoKDService.createItem(kdToSave);

            this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, savedDomain);

            this.clog.info(`KnowledgeDomainService: saveKnowledgeDomain: saved domain:`, {sd: savedDomain, all: this._allKnowledgeDomains});
        }
        else {
            this.clog.debug(`KnowledgeDomainService: saveKnowledgeDomain: Already has an ID, no need to get a new one.`);

            const updatedDomain = await this.mongoKDService.updateItem(kdToSave);
            this.clog.info(`KnowledgeDomainService: saveKnowledgeDomain: updated domain:`, updatedDomain)

            this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, kdToSave);
        }

    }



    public async saveKnowledgeDomain_localstorage(theDomain: KnowledgeDomainItem) {

        this.clog.debug(`KnowledgeDomainService: Entering, will save a domain:`, { dmn: theDomain });
        this.clog.debug(`KnowledgeDomainService: is id assigned?:`, Functionals.isIDAssigned(theDomain));

        if (! Functionals.isIDAssigned(theDomain)) {

            this.clog.debug(`KnowledgeDomainService: SaveKnowledgeDomain: No ID assigned, getting one.`);

            theDomain.UniqueID = await this._recordIDsService.getUniqueID();

            this.clog.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Got an ID:`, theDomain.UniqueID);

            this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, theDomain);
            
            await this.persistKnowledgeDomains();
            this.mongoKDService.createItem(theDomain);

        }
        else {
            this.clog.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Already has an ID, no need to get a new one.`);
            this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, theDomain);
            await this.persistKnowledgeDomains();
        }

    }

    private async loadAllKnowledgeDomains(): Promise<KnowledgeDomainItem[]> {

        return new Promise<KnowledgeDomainItem[]> (async (resolve, reject) => {
            
            const allMongoDomains = await this.mongoKDService.getItems();
            
            this._allKnowledgeDomains = allMongoDomains || [];

            this.clog.debug(`KnowledgeDomainService: loadAllKnowledgeDomains: Resolving with domains:`, this._allKnowledgeDomains);

            resolve(this._allKnowledgeDomains);

        });

    }

    private loadAllKnowledgeDomains_localStorage(): Promise<KnowledgeDomainItem[]> {

        return new Promise<KnowledgeDomainItem[]> ((resolve, reject) => {
            
            this.mongoKDService.getItems();
            
            this._allKnowledgeDomains = JSON.parse(localStorage.getItem("knowledgedomains"));

            this._allKnowledgeDomains = this._allKnowledgeDomains || [];

            this.clog.debug(`KnowledgeDomainService: loadAllKnowledgeDomains: Resolving with domains:`, this._allKnowledgeDomains);

            resolve(this._allKnowledgeDomains);

        });

    }

}
