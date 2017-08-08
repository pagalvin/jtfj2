import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as FactItemModule from './FactModel';
import { FactsService } from './Facts.Service';
import { KnowledgeDomainItem } from '../KnowledgeDomains/KDItem';
import { KnowledgeDomainsService } from '../KnowledgeDomains/KD.Service';

import * as ErrorsModule from "../../Framework/ErrorHandling/ErrorsService";
import * as CommonInterfaces from '../../Interfaces/Interfaces';

import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';

@Component({
    templateUrl: './FactCrud.View.html',
    selector: 'jtfj-fact-crud-component'
})
export class FactCrudComponent implements OnInit, OnDestroy {

    private _allFact: KnowledgeDomainItem[];
    public get AllKnowledgeDomain(): KnowledgeDomainItem[] {
        return this._allFact;
    }

    private isNewFactItem: boolean = false;
    private existingFactID: string = null;

    public get IsNewItem(): boolean { return this.isNewFactItem; }

    public InputFactStatement: string;
    public InputDescription: string;
    public InputKnowledgeDomains: string[];

    public get AllKnowledgeDomains() { return this.kdService.AllKnowledgeDomains; };

    public AllQuestions: FactItemModule.IQuestion[];
    public AllWrongAnswers: FactItemModule.IWrongAnswer[];
    public AllCorrectAnswers: FactItemModule.ICorrectAnswer[];

    private paramSubscription: Subscription;

    constructor(private clog: ConsoleLog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private kdService: KnowledgeDomainsService,
        private factsService: FactsService,
        private errorsService: ErrorsModule.ErrorsService) {

        this.clog.debug(`KnowledgeDomainCrudController: ctor: Entering.`);

    } // constructor

    public ngOnInit() {

        this.clog.debug(`KDCrud.Component: ngOnInit: Entering.`);

        try {
            this.paramSubscription = this.activatedRoute.params.subscribe(async params => {

                this.clog.debug(`FactCrudComponent: ngOnInit: got params:`, params)

                this.isNewFactItem = (params["factID"] && new String(params["factID"]).toLowerCase()) === "new" ? true : false;
                this.existingFactID = this.isNewFactItem ? null : params["factID"];

                await this.kdService.getKnowledgeDomains();

                if (this.isNewFactItem) {
                    this.initializeNewFact();
                }
                else {
                    this.initializeExistingFact(this.existingFactID);
                }
            });
        }
        catch (initializationException) {
            this.clog.error(`FactCrud.Component: Error: Failed to initialize due to exception:`, initializationException);
            throw this.errorsService.GetNewError(`FactCrud.Component: Error: Failed to initialize due to exception.`, initializationException);
        }

    }

    public ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }

    private async initializeExistingFact(forFactID: string) {

        try {
            const theFact = await this.factsService.getFactByUniqueID(forFactID);
            this.InputFactStatement = theFact.FactStatement;
            this.InputDescription = theFact.Description;
            this.InputKnowledgeDomains = theFact.KnowledgeDomains.map((aKD) => { return aKD.Title; });;
            this.AllQuestions = [].concat(theFact.Questions);
            this.AllWrongAnswers = [].concat(theFact.WrongAnswers);
            this.AllCorrectAnswers = [].concat(theFact.CorrectAnswers);
        }
        catch (errorDetails) {
            this.clog.error(`FactCrudController: _intializeExistingFact: Failed to load the fact, error details:`, errorDetails);
            throw this.errorsService.GetNewError("FactCrudController: _intializeExistingFact: Failed to load the fact.", errorDetails);
        }

    }

    public handleDeleteQuestion(theQuestion: FactItemModule.IQuestion) {
        theQuestion._isDeleted = true;
    }

    public handleDeleteWrongAnswer(theWrongAnswer: FactItemModule.IWrongAnswer) {
        theWrongAnswer._isDeleted = true;
    }

    public handleDeleteCorrectAnswer(theCorrectAnswer: FactItemModule.ICorrectAnswer) {
        theCorrectAnswer._isDeleted = true;
    }

    public isKDSelected(theDomainTitle: string) {

        if (!this.InputKnowledgeDomains) {
            return false;
        }
        if (this.InputKnowledgeDomains && this.InputKnowledgeDomains.length < 1) {
            return false;
        }

        return this.InputKnowledgeDomains.filter((aKD) => { return aKD === theDomainTitle; }).length > 0;

    }

    public toggleKD(kdTitleToToggle: string) {

        if (this.isKDSelected(kdTitleToToggle)) {
            this.InputKnowledgeDomains = this.InputKnowledgeDomains.filter((aKD) => { return aKD !== kdTitleToToggle });
        }
        else {
            this.InputKnowledgeDomains = this.InputKnowledgeDomains.concat(kdTitleToToggle);
        }

    }

    private handleAddNewQuestion() {
        const newQuestion: FactItemModule.IQuestion = {
            Question: "",
            _isEditing: true,
            _isDeleted: false
        };

        this.AllQuestions = this.AllQuestions.concat(newQuestion);
    }

    private handleAddNewCorrectAnswer() {
        const newCorrectAnswer: FactItemModule.ICorrectAnswer = {
            CorrectAnswer: "",
            _isEditing: true,
            _isDeleted: false
        };

        this.AllCorrectAnswers = this.AllCorrectAnswers.concat(newCorrectAnswer);
    }

    private handleAddNewWrongAnswer() {
        const newWrongAnswer: FactItemModule.IWrongAnswer = {
            WrongAnswer: "",
            TruthAffinity: 50,
            _isEditing: true,
            _isDeleted: false
        };

        this.AllWrongAnswers = this.AllWrongAnswers.concat(newWrongAnswer);
    }

    private initializeNewFact() {

        this.InputDescription = "";
        this.InputKnowledgeDomains = [];
        this.InputFactStatement = "";
        this.AllWrongAnswers = [];
        this.AllQuestions = [];
        this.AllCorrectAnswers = [];
    }

    private returnToFactList() {
        this.router.navigate(["/Admin/Facts"]);
    }

    public async handleSave() {

        this.clog.debug(`FactCrudComponent: handleSave: Entering.`);

        const factToSave: FactItemModule.FactItem = new FactItemModule.FactItem();
        const confirmationMsg: string = this.isNewFactItem ? "Saved a new fact!" : "Updated an existing fact!";

        factToSave.FactStatement = this.InputFactStatement;
        factToSave.Description = this.InputDescription;
        // factToSave.KnowledgeDomains = this.InputKnowledgeDomains;
        factToSave.KnowledgeDomains = await this.kdService.getKnowledgeDomainsByTitles(this.InputKnowledgeDomains);
        factToSave.Questions = this.AllQuestions.filter((anItem) => { return !anItem._isDeleted; });
        factToSave.WrongAnswers = this.AllWrongAnswers.filter((anItem) => { return !anItem._isDeleted; });
        factToSave.CorrectAnswers = [].concat(this.AllCorrectAnswers);

        if (!this.isNewFactItem) {
            factToSave.UniqueID = this.existingFactID;
        }

        await this.factsService.saveFact(factToSave);

        this.returnToFactList();

        // const OKModal = this._modalService.CreateOKModal("Saved Fact", confirmationMsg).result.then(
        //     (result) => {
        //         this.returnToFactList();
        //     }
        // );

    }

    public handleDelete() {

        this.factsService.deleteFactByUniqueID(this.existingFactID);
        this.returnToFactList();

        // const confirmModal = this._modalService.CreateConfirmModal("Confirm Delete", "Are you sure you want to delete this item?");

        // confirmModal.result.then(
        //     (result) => {
        //         if (result) {
        //             this.factsService.DeleteFactByUniqueID(this.$routeParams.factID);
        //             this.returnToFactList();
        //         }
        //     }
        // );
    }

    public handleCancel(isFormDirty: boolean) {

        this.returnToFactList();

        // if (isFormDirty) {
        //     const confirmModal = this._modalService.CreateConfirmModal("Unsaved Changes", "Warning: You have unsaved changes. Are you sure you want to cancel?");

        //     confirmModal.result.then(
        //         (result) => {
        //             if (result) {
        //                 this.returnToFactList();
        //             }
        //         }
        //     );
        // }
        // else {
        //     this.returnToFactList();
        // }
    }

}

