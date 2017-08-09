import { Injectable } from '@angular/core';

import { RecordIDsService } from '../../Framework/Data Services/RecordIDsService';
import { AbstractAngularService } from '../../Framework/Data Structures/AbstractAngularService';
import { Functionals } from '../../Framework/Util/Functionals';
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import { IQuizTemplateItem, QuizTemplateItem } from './QT.Model';
 
"use strict";

@Injectable()
export class QuizTemplatesService extends AbstractAngularService {

    private localStorageKey: string = "AllQuizTemplates";

    private allQuizTemplates: IQuizTemplateItem[];
    public get AllQuizTemplates(): IQuizTemplateItem[] { return this.allQuizTemplates; }

    private loadAllQuizTemplatesPromise: Promise<boolean>;

    constructor(
        private clog: ConsoleLog,
        private recordsService: RecordIDsService) {

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

    public deleteQuizTemplateByUniqueID(forID: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this.allQuizTemplates = this.allQuizTemplates.filter((anItem) => {
                return anItem.UniqueID !== forID;
            });

            this.persistQuizTemplates();

            resolve(true);
        })

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

        return new Promise((resolve, reject) => {
            if (!Functionals.isIDAssigned(theQuizTemplate)) {
                this.recordsService.getUniqueID().then(
                    (newID) => {
                        theQuizTemplate.UniqueID = newID;
                        this.allQuizTemplates = Functionals.getMergedCollection(this.allQuizTemplates, theQuizTemplate);
                        this.persistQuizTemplates();
                        resolve(true);
                    }
                );
            }
            else {
                this.allQuizTemplates = Functionals.getMergedCollection(this.allQuizTemplates, theQuizTemplate);
                this.persistQuizTemplates();
                resolve(true);
            }
        });

    }

    private persistQuizTemplates(): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.allQuizTemplates));
    }

    private loadAllQuizTemplates(): Promise<boolean> {

        this.clog.debug(`QuizTemplatesService: Entering, retrieving all quiz templates from local storage.`);

        return new Promise((resolve, reject) => {
            const rawData = localStorage.getItem(this.localStorageKey);

            this.clog.debug(`QuizTemplatesService: Entering, raw data:`, {d: rawData});

            if (rawData) {
                this.allQuizTemplates = JSON.parse(rawData);
                this.allQuizTemplates = this.allQuizTemplates.map((aQuizTemplate) => {
                    return QuizTemplateItem.initializeNulls(aQuizTemplate);
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
