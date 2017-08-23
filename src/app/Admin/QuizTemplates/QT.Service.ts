import { KnowledgeDomainsService } from '../KnowledgeDomains/KD.Service';
import { Injectable, OnInit } from '@angular/core';
import { RecordIDsService } from '../../Framework/Data Services/RecordIDsService';
import { AbstractAngularService } from '../../Framework/Data Structures/AbstractAngularService';
import { Functionals } from '../../Framework/Util/Functionals';
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { IQuizTemplateItem, QuizTemplateItem } from './QT.Model';
import { MongoService } from '../../Framework/Data Services/MongoData.service';
import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { FactsService } from '../Facts/Facts.Service';

"use strict";

@Injectable()
export class QuizTemplatesService extends AbstractAngularService {

    private localStorageKey: string = "AllQuizTemplates";

    private allQuizTemplates: IQuizTemplateItem[];
    public get AllQuizTemplates(): IQuizTemplateItem[] { return this.allQuizTemplates; }

    private loadAllQuizTemplatesPromise: Promise<boolean> = null;

    constructor(
        private clog: ConsoleLog,
        private recordsService: RecordIDsService,
        private factsService: FactsService,
        private kdService: KnowledgeDomainsService,
        private mongoService: MongoService) {

        super();

        this.loadAllQuizTemplatesPromise = this.loadAllQuizTemplates();

    }
    
    public ping() {
        this.clog.debug(`QuizTemplatesService: got a ping, pinging your right back.`);
        this.loadAllQuizTemplates();
    }


    public LoadAll() {
        
        return this.loadAllQuizTemplatesPromise;
    }

    public deleteQuizTemplateByUniqueIDOLD(forID: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this.allQuizTemplates = this.allQuizTemplates.filter((anItem) => {
                return anItem.UniqueID !== forID;
            });

            this.persistQuizTemplates();

            resolve(true);
        })

    }

    public deleteQuizTemplateByUniqueID(forID: string): Promise<boolean> {

        return new Promise<boolean>(
            async (resolve, reject) => {

                const itemToDelete = await this.getQuizTemplateByUniqueID(forID);

                const deleteResult = await this.mongoService.deleteItemG<QuizTemplateItem>(itemToDelete);

                this.allQuizTemplates = this.allQuizTemplates.filter((anItem) => {
                    return anItem.UniqueID !== forID;
                });

                resolve(deleteResult);
            });

    }

    public getQuizTemplateByUniqueID(forID: string): Promise<IQuizTemplateItem> {

        this.clog.debug(`QuizTemplatesService: GetQuizTemplateByID: loading a QuizTemplate, [${forID}].`);

        return new Promise((resolve, reject) => {
            this.loadAllQuizTemplatesPromise.then(
                () => {
                    this.clog.debug(`QuizTemplatesService: GetQuizTemplateByID: all QuizTemplates:`, this.allQuizTemplates);
                    resolve(<IQuizTemplateItem>Functionals.getEntityByUniqueID(forID, this.allQuizTemplates));
                },
                (errorDetails) => {
                    this.clog.debug(`GetQuizTemplateByID: Failed to load the QuizTemplates database, error details:`, errorDetails);
                    reject(Functionals.getNewError("QuizTemplatesService: GetQuizTemplateByID: Failed to retrieve the QuizTemplate.", errorDetails));
                }
            );
        })

    }

    public saveQuizTemplate(theQuizTemplate: IQuizTemplateItem): Promise<boolean> {

        this.clog.debug(`QT.Service: saveQuizTemplate: Entering, saving a QT:`, theQuizTemplate);

        return new Promise(
            async (resolve, reject) => {

                if (!Functionals.isIDAssigned(theQuizTemplate)) {

                    const saveResult = await this.mongoService.createItemG<QuizTemplateItem>(theQuizTemplate);

                    theQuizTemplate.UniqueID = saveResult.UniqueID;
                    this.allQuizTemplates = Functionals.getMergedCollection(this.allQuizTemplates, theQuizTemplate);
                    resolve(true);
                }
                else {
                    const saveResult = await this.mongoService.updateItemG<QuizTemplateItem>(theQuizTemplate);
                    this.allQuizTemplates = Functionals.getMergedCollection(this.allQuizTemplates, theQuizTemplate);
                    resolve(true);
                }
        });

    }

    private persistQuizTemplates(): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.allQuizTemplates));
    }

    public async loadAllQuizTemplates(): Promise<boolean> {
        
        if (this.loadAllQuizTemplatesPromise) { 
            
            return this.loadAllQuizTemplatesPromise; 
        }

        // Need to load knowledge domains and facts first
        await [this.kdService.getKnowledgeDomains(), this.factsService.loadAllFacts()];

        this.loadAllQuizTemplatesPromise = new Promise<boolean>( 
            async (resolve, reject) => {
                
                const rawQuizTemplates = await this.mongoService.loadAllItems<QuizTemplateItem>(QuizTemplateItem.GetEntityMetadata());

                if (rawQuizTemplates) {
                    this.allQuizTemplates = rawQuizTemplates.map((aQuizTemplate) => {
                        return QuizTemplateItem.deNulled(aQuizTemplate);
                    });
                    this.clog.debug(`QT.Service: loadAllQuizTemplates: Got some quiz templates:`, this.allQuizTemplates);
                    resolve(true);
                }
                else {
                    this.allQuizTemplates = [];
                    resolve(true);
                }
            }
        )

        return this.loadAllQuizTemplatesPromise;

    }

    private loadAllQuizTemplatesOLD(): Promise<boolean> {

        this.clog.debug(`QuizTemplatesService: Entering, retrieving all quiz templates from local storage.`);

        
        return new Promise((resolve, reject) => {
            const rawData = localStorage.getItem(this.localStorageKey);

            this.clog.debug(`QuizTemplatesService: Entering, raw data:`, {d: rawData});

            if (rawData) {
                this.allQuizTemplates = JSON.parse(rawData);
                this.allQuizTemplates = this.allQuizTemplates.map((aQuizTemplate) => {
                    return QuizTemplateItem.deNulled(aQuizTemplate);
                });
                this.clog.debug(`QT.Service: loadAllQuizTemplates: Got a some quiz templates:`, this.allQuizTemplates);
                resolve(true);
            }
            else {
                this.allQuizTemplates = [];
                resolve(true);
            }
    });
    
    }

}
