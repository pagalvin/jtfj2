import * as F from "../../Framework/Util/Functionals";
import { AbstractAngularService } from "../../Framework/Data Structures/AbstractAngularService";
import { RecordIDsService } from "../../Framework/Data Services/RecordIDsService";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import * as QIM from "./QIModel";

import { Injectable } from "@angular/core";

"use strict";

@Injectable()
export class QIService extends AbstractAngularService {
 
    private _localStorageKey: string = "Quiz";

    constructor(
        private clog: ConsoleLog,
        private _recordsService: RecordIDsService) {

        super();

    }

    public ping() {
        this.clog.debug(`Quizervice: got a ping, pinging your right back.`);
    }


    public DeleteQuizByUniqueID(forID: string): Promise<boolean> {
        return this._persistQuiz();
    }

    public GetQuizByUniqueID(forID: string): Promise<QIM.IQuizInstanceItem> {

        return new Promise<QIM.IQuizInstanceItem>( (resolve, reject) => { resolve(null); })
        //const deferred = this.$q.defer<jtfj.Entities.IQuizInstanceItem>();

        //this.$log.debug(`Quizervice: GetQuizByID: loading a Quiz, [${forID}].`);

        //this._loadAllQuizPromise.then(
        //    () => {
        //        this.$log.debug(`Quizervice: GetQuizByID: all Quiz:`, this._allQuiz);
        //        deferred.resolve(<jtfj.Entities.IQuizInstanceItem>jtfj.Framework.Functionals.getEntityByUniqueID(forID, this._allQuiz));
        //    },
        //    (errorDetails) => {
        //        this.$log.debug(`GetQuizByID: Failed to load the Quiz database, error details:`, errorDetails);
        //        deferred.reject({
        //            msg: "Quizervice: GetQuizByID: Failed to retrieve the Quiz.", errorDetails: errorDetails
        //        });
        //    }
        //);

        //return deferred.promise;

    }

    public SaveQuiz(theQuiz: QIM.IQuizInstanceItem): Promise<boolean> {

        return new Promise<boolean>( (resolve, reject) => { resolve(true); })

        //this.$log.debug(`Quizervice: SaveQuiz: Entering. before saving, all Quiz and Quiz to save:`, {
        //    presave: this._allQuiz, QuizToSave: theQuiz
        //});

        //const deferred = this.$q.defer<boolean>();

        //if (!F.IsIDAssigned(theQuiz)) {
        //    this._recordsService.GetUniqueID().then(
        //        (newID) => {
        //            theQuiz.UniqueID = newID;
        //            this._allQuiz = F.mergeEntityIntoCollection(this._allQuiz, theQuiz);
        //            this._persistQuiz();
        //            deferred.resolve(true);
        //        }
        //    );
        //}
        //else {
        //    this._allQuiz = F.mergeEntityIntoCollection(this._allQuiz, theQuiz);
        //    this._persistQuiz();
        //    deferred.resolve(true);
        //}

        //return deferred.promise;

    }

    private _persistQuiz(): Promise<boolean> {
        return new Promise( (resolve, reject) => { resolve(true); } )

        //localStorage.setItem(this._localStorageKey, JSON.stringify(this._allQuiz));
    }

    private _loadAllQuiz(): Promise<boolean> {

        return new Promise ( (resolve, reject) => { return true; })

        //this.$log.debug(`Quizervice: Entering, retrieving all quiz templates from local storage.`);

        //const deferred = this.$q.defer<boolean>();

        //const rawData = localStorage.getItem(this._localStorageKey);

        //this.$log.debug(`Quizervice: Entering, raw data:`, rawData);

        //if (rawData) {
        //    this._allQuiz = JSON.parse(rawData);
        //    this._allQuiz = this._allQuiz.map((aQuiz) => {
        //        return Entities.QuizInstanceItem.MakeSafe(aQuiz);
        //    });
        //}
        //else {
        //    this._allQuiz = [];
        //}

        //deferred.resolve(true);

        //return deferred.promise;

    }


}

