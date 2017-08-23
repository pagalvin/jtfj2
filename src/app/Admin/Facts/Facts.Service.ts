import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { IEntityMetadata } from '../../Framework/Data Structures/IEntityMetadata';
import { Functionals } from '../../Framework/Util/Functionals';
import { RecordIDsService } from "../../Framework/Data Services/RecordIDsService";
import { IFactItem, FactItem } from "./FactModel";
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { AbstractAngularService } from '../../Framework/Data Structures/AbstractAngularService'
import { Injectable } from '@angular/core';
import { MongoService } from '../../Framework/Data Services/MongoData.service';

"use strict";

@Injectable()
export class FactsService extends AbstractAngularService {

    private _localStorageKey: string = "AllFacts";

    private _allFacts: IFactItem[];
    public get AllFacts(): IFactItem[] { return this._allFacts; }

    private _loadAllFactsPromise: Promise<boolean>;

    constructor(
        private cLog: ConsoleLog,
        private recordsService: RecordIDsService,
        private mongoService: MongoService) {

        super();

        this._loadAllFactsPromise = this.loadAllFactsAsync();

    }

    public ping() {
        this.cLog.debug(`FactsService: got a ping, pinging your right back.`);
        this.loadAllFacts();
    }

    public async loadAllFacts() {
        return this._loadAllFactsPromise;
    }

    public async deleteFactByUniqueIDOLD(forID: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            this._allFacts = this._allFacts.filter((anItem) => {
                return anItem.UniqueID !== forID;
            });

            resolve(this.persistFacts());
        })
    }

    
    public async deleteFactByUniqueID(theFactID: string): Promise<boolean> {
        
        return new Promise<boolean>( async (resolve, rejectO) => {

            const ll = "FactsService: deleteFactByID: ";

            this.cLog.info(`${ll} Entering. Will delete a fact with ID [${theFactID}].`);

            const itemToDelete = await this.getFactByUniqueID(theFactID);

            const deleteResult = await this.mongoService.deleteItemG<FactItem>(itemToDelete);

            this.cLog.info(`KD.Service: deleteKowledgeDomainByID: Item successfully deleted, updating all KDs.`);
            
            this._allFacts = Functionals.filterOutEntityByUniqueID(theFactID, this._allFacts);
            
            resolve(true);
        })
    }

    public async getFactByUniqueID(forID: string): Promise<FactItem> {

        this.cLog.debug(`FactsService: GetFactByID: loading a fact, [${forID}].`);

        return new Promise<FactItem>(async (resolve, reject) => {
            try {
                await this._loadAllFactsPromise;
                resolve(Functionals.getEntityByUniqueID(forID, this._allFacts));
            }
            catch (getException) {
                this.cLog.debug(`GetFactByID: Failed to load the facts database, error details:`, getException);
                reject({
                    msg: "FactsService: GetFactByID: Failed to retrieve the fact.",
                    errorDetails: getException
                });

            }
        });

    }

    
    public async saveFactOld(theFact: IFactItem): Promise<boolean> {

        this.cLog.debug(`FactsService: SaveFact: Entering. before saving, all facts and fact to save:`, {
            presave: this._allFacts, factToSave: theFact
        });

        return new Promise<boolean>( async (resolve, reject) => {
            if (! Functionals.isIDAssigned(theFact)) {

                const newID = await this.recordsService.getUniqueID();

                theFact.UniqueID = newID;
                this._allFacts = Functionals.getMergedCollection(this._allFacts, theFact);
                await this.persistFacts();

                resolve(true);
            }
            else {
                this._allFacts = Functionals.getMergedCollection(this._allFacts, theFact);
                await this.persistFacts();
                this.cLog.debug(`FactsService: SaveFact: Existing fact persisted, resolving promise to true.`);
                resolve(true);
            }

        })

    }

    public async saveFact(theFact: FactItem): Promise<boolean> {

        return new Promise<boolean>(
            async (resolve, reject) => {

                const ll = "FactService: saveFAct: ";

                this.cLog.info(`${ll} Entering, will save a fact:`, { gct: theFact });
                this.cLog.info(`${ll} is id assigned?:`, Functionals.isIDAssigned(theFact));

                if (!Functionals.isIDAssigned(theFact)) {

                    this.cLog.debug(`${ll} No ID assigned, will create a new record on the mongo side.`);

                    const savedFact = await this.mongoService.createItemG<FactItem>(theFact);

                    this._allFacts = Functionals.getMergedCollection(this._allFacts, theFact);

                    this.cLog.info(`${ll} saved fact:`, { sf: savedFact, all: this._allFacts });

                    resolve(true);
                }
                else {
                    this.cLog.info(`${ll} Already has an ID, no need to get a new one.`);

                    const updatedFact = await this.mongoService.updateItemG(theFact);
                    this.cLog.info(`${ll}: updated domain:`, updatedFact)

                    this._allFacts = Functionals.getMergedCollection(this._allFacts, theFact);
                    resolve(true);
                }

            }
        )
    }


    private async persistFacts(): Promise<boolean> {

        this.cLog.debug(`Facts.Service: persistFacts: Entering.`);

        return new Promise<boolean>((resolve, reject) => {
            try {
                
                localStorage.setItem(this._localStorageKey, JSON.stringify(this._allFacts));
                resolve(true);
            }
            catch (persistException) {
                reject(persistException);
            }
        });

    }

    private async loadAllFactsAsyncOLD(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            try {
                const rawData = localStorage.getItem(this._localStorageKey);

                if (rawData) {
                    this._allFacts = JSON.parse(rawData);
                    this._allFacts = this._allFacts.map((aFact) => {
                        return FactItem.cleanNulls(aFact);
                    });
                }
                else {
                    this._allFacts = [];
                }

                this.cLog.debug(`FactsService: _loadAllFacts: resolving with true.`);
                resolve(true);

            }
            catch (errorDetails) {
                reject(false);
            }
        });
    }
   
    private async loadAllFactsAsync(): Promise<boolean> {
        
        return new Promise<boolean> (async (resolve, reject) => {
            
            const ll = "FactService: loadAllFactsAsync: ";
            
            const allMongoFacts = await this.mongoService.getAllItemsG<FactItem>(FactItem.GetEntityMetadata());
            
            this.cLog.info(`${ll} got some facts:`, allMongoFacts);

            if (allMongoFacts) {
                this._allFacts = allMongoFacts.map((aFact) => {
                    return FactItem.cleanNulls(aFact);
                });
            }
            else {
                this._allFacts = [];
            }

            this.cLog.debug(`FactsService: _loadAllFacts: resolving with true.`);
            
            resolve(true);

        });

    }

}
