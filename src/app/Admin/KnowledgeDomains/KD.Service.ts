
import { Functionals } from '../../Framework/Util/Functionals'; 
import { RecordIDsService } from "../../Framework/Data Services/RecordIDsService";
import { KnowledgeDomainItem } from "./KDItem";
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { Injectable } from '@angular/core';
import { Util } from '../../Framework/Util/Util';
import { AbstractAngularService } from '../../Framework/Data Structures/AbstractAngularService'

"use strict";

@Injectable()
export class KnowledgeDomainsService extends AbstractAngularService {

    private _allKnowledgeDomains: KnowledgeDomainItem[];
    public get AllKnowledgeDomains() { return this._allKnowledgeDomains; }

    private kdLoadPromise: Promise<KnowledgeDomainItem[]>;

    constructor(private _recordIDsService: RecordIDsService,
        private clog: ConsoleLog) {

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

        return new Promise<KnowledgeDomainItem[]>(async (resolve, reject) => {

            await this.kdLoadPromise;

            const result = titles.reduce((prev: KnowledgeDomainItem[], curr: string) => {

                const foundKD = this._allKnowledgeDomains.filter((aKD) => { return aKD.Title === curr })[0];

                prev = prev.concat(foundKD);

                return prev;
            }, []);

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
        this._allKnowledgeDomains = Functionals.filterOutEntityByUniqueID(theDomainID, this._allKnowledgeDomains);
        return await this.persistKnowledgeDomains();
    }

    public async saveKnowledgeDomain(theDomain: KnowledgeDomainItem) {

        this.clog.debug(`KnowledgeDomainService: Entering, will save a domain:`, { dmn: theDomain });
        this.clog.debug(`KnowledgeDomainService: is id assigned?:`, Functionals.isIDAssigned(theDomain));

        if (! Functionals.isIDAssigned(theDomain)) {

            this.clog.debug(`KnowledgeDomainService: SaveKnowledgeDomain: No ID assigned, getting one.`);

            theDomain.UniqueID = await this._recordIDsService.getUniqueID();

            this.clog.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Got an ID:`, theDomain.UniqueID);

            this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, theDomain);
            
            await this.persistKnowledgeDomains();
            
        }
        else {
            this.clog.debug(`KnowledgeDomainService: SaveKnowledgeDomain: Already has an ID, no need to get a new one.`);
            this._allKnowledgeDomains = Functionals.getMergedCollection(this._allKnowledgeDomains, theDomain);
            await this.persistKnowledgeDomains();
        }

    }

    private loadAllKnowledgeDomains(): Promise<KnowledgeDomainItem[]> {

        return new Promise<KnowledgeDomainItem[]> ((resolve, reject) => {
            
            this._allKnowledgeDomains = JSON.parse(localStorage.getItem("knowledgedomains"));

            this._allKnowledgeDomains = this._allKnowledgeDomains || [];

            this.clog.debug(`KnowledgeDomainService: loadAllKnowledgeDomains: Resolving with domains:`, this._allKnowledgeDomains);

            resolve(this._allKnowledgeDomains);

        });

    }

}
