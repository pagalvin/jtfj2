import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Functionals as F } from "../../Framework/Util/Functionals";
import { ErrorsService } from "../../Framework/ErrorHandling/ErrorsService";
import { QuizTemplatesService } from "./QT.Service";
import { KnowledgeDomainsService } from "../KnowledgeDomains/KD.Service";
import { FactsService } from "../Facts/Facts.Service";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import * as KDM from "../KnowledgeDomains/KDItem";
import * as FM from "../Facts/FactModel";
import * as QTM from "./QT.Model";


    @Component({
        templateUrl: './/QTCrud.View.html',
        selector: 'jtfj-qt-crud-component'
    })
    export class QTCrudComponent {

        private _allQuizTemplate: KDM.KnowledgeDomainItem[];
        private isNewQuizTemplateItem: boolean = false;
        public get IsNewItem(): boolean { return this.isNewQuizTemplateItem; }

        public InputQuizTemplateTitle: string;
        public InputDescription: string;
        public InputKnowledgeDomains: KDM.KnowledgeDomainItem[];

        public get AllKnowledgeDomains() { return this.kdService.AllKnowledgeDomains; };
        public AllFacts: FM.IFactItem[];
        public AllSelectedFacts: FM.IFactItem[];
        public AllUnselectedFacts: FM.IFactItem[];
        public AllViewFacts: FM.IFactItem[];

        private existingQuizTemplateID: string = null;

        private paramSubscription: Subscription;

        public ActiveFilters: { AllFacts: boolean; OnlySelectedFacts: boolean; OnlyUnselectedFacts: boolean; SearchFilter: string; };

        constructor(private clog: ConsoleLog,
            private activatedRoute: ActivatedRoute,
            private router: Router,
            private quizTemplatesService: QuizTemplatesService,
            private kdService: KnowledgeDomainsService,
            private factsService: FactsService,
            private errorsService: ErrorsService
        ) {

            this.clog.debug(`QTCrud.Component: ctor: Entering.`);

            //this._initializeFactArrays();
            // this._initializeQuizTemplate();

        } // constructor

        public ngOnInit() {

            this.clog.debug(`QTCrud.Component: ngOnInit: Entering.`);

            this.ActiveFilters = {
                AllFacts: false,
                OnlySelectedFacts: true,
                OnlyUnselectedFacts: false,
                SearchFilter: ""
            }
            this.ActiveFilters.SearchFilter = "";

            try {
                this.paramSubscription = this.activatedRoute.params.subscribe(async params => {
                        
                    this.clog.debug(`FactCrudComponent: ngOnInit: got params:`, params)

                    this.isNewQuizTemplateItem = (params["quizTemplateID"] && new String(params["quizTemplateID"]).toLowerCase()) === "new" ? true : false;
                    this.existingQuizTemplateID = this.isNewQuizTemplateItem ? null : params["quizTemplateID"];
                    
                    const kdPromise = this.kdService.getKnowledgeDomains();
                    const factsPromise = this.factsService.loadAllFacts();
                    const quizTemplatePromise = this.isNewQuizTemplateItem ? this.initializeNewQuizTemplate() : this._initializeExistingQuizTemplate();

                    await [kdPromise, factsPromise, quizTemplatePromise];
                    
                    this.clog.debug(`QuizTemplatecontroller: _initializeQuizTemplate: Promises all resolved!`);

                    this.AllFacts = this.factsService.AllFacts;
                    this.clog.debug(`QTCrud.Component: _initializeQuizTemplate: all facts:`, this.AllFacts);

                });
            }
            catch (initializationException) {
                this.clog.error(`QTCrud.Component: Error: failed to initialize this quiz template! Error details:`, initializationException);
                throw this.errorsService.GetNewError(`FactCrud.Component: Error: Failed to initialize due to exception.`, initializationException);
            }

        }

        public ngOnDestroy() {
            this.paramSubscription.unsubscribe();
        }

        public handleFilterOnlySelectedFacts() {
            this.ActiveFilters.AllFacts = false;
            this.ActiveFilters.OnlySelectedFacts = true;
            this.ActiveFilters.OnlyUnselectedFacts = false;

            this.AllViewFacts = [].concat(this.AllSelectedFacts);
        }

        public handleFilterOnlyUnselectedFacts() {

            this.clog.debug(`QTCrudComponent: handleFilterOnlyUnselectedFacts: Entering.`);

            this.ActiveFilters.AllFacts = false;
            this.ActiveFilters.OnlySelectedFacts = false;
            this.ActiveFilters.OnlyUnselectedFacts = true;

            this.AllViewFacts = [].concat(this.AllUnselectedFacts);
        }

        public handleFilterAllFacts() {
            this.ActiveFilters.AllFacts = true;
            this.ActiveFilters.OnlySelectedFacts = true;
            this.ActiveFilters.OnlyUnselectedFacts = true;
            this.AllViewFacts = [].concat(this.AllFacts);

        }

        // private _initializeQuizTemplate() {

        //     this.isNewQuizTemplateItem = this.$routeParams.quizTemplateID.toLowerCase() === "new" ? true : false;

        //     // set up data load promises
        //     const loadAllFactsPromise = this.factsService.LoadAllFacts();
        //     const loadAllKnowledgeDomains = this.kdService.GetKnowledgeDomains();

        //     const initializeTemplatePromise = this.isNewQuizTemplateItem ? this._initializeNewQuizTemplate() : this._initializeExistingQuizTemplate();

        //     this.clog.debug(`QuizTemplatecontroller: _initializeQuizTemplate: Waiting on all promises.`);

        //     this.$q.all([loadAllFactsPromise, loadAllKnowledgeDomains, initializeTemplatePromise]).then(
        //         () => {

        //             this.clog.debug(`QuizTemplatecontroller: _initializeQuizTemplate: Promises all resolved!`);

        //             this.AllFacts = this.factsService.AllFacts;
        //             this.clog.debug(`QTCrud.Component: _initializeQuizTemplate: all facts:`, this.AllFacts);

        //             this.AllUnselectedFacts = this.AllFacts.reduce((allUnselectedFacts, currentAllFact) => {

        //                 if (F.entityIsInCollection(this.AllSelectedFacts, currentAllFact.UniqueID)) {
        //                     return allUnselectedFacts;
        //                 }

        //                 return allUnselectedFacts.concat(currentAllFact);

        //             }, []);

        //         },
        //         (errorDetails) => {
        //             this.clog.error(`QTCrud.Component: Error: failed to initialize this quiz template! Error details:`, errorDetails);
        //         }
        //     );

        // }

        private _initializeExistingQuizTemplate(): Promise<boolean>{

            return new Promise<boolean>((resolve, reject) => {
                this.quizTemplatesService.getQuizTemplateByUniqueID(this.existingQuizTemplateID).then(
                    (theQuizTemplate) => {

                        this.InputQuizTemplateTitle = theQuizTemplate.Title;
                        this.InputDescription = theQuizTemplate.Description;
                        this.InputKnowledgeDomains = theQuizTemplate.KnowledgeDomains;
                        this.AllSelectedFacts = [].concat(theQuizTemplate.Facts) || [];
                        this.AllViewFacts = [].concat(theQuizTemplate.Facts) || [];

                        this.AllUnselectedFacts = this.AllFacts.reduce((allUnselectedFacts, currentAllFact) => {

                            if (F.entityIsInCollection(this.AllSelectedFacts, currentAllFact.UniqueID)) {
                                this.clog.debug(`QTCrud.Component: this fact is in the collection:`, currentAllFact)
                                return allUnselectedFacts;
                            }

                            this.clog.debug(`QTCrud.Component: this fact is NOT in the collection, adding to allUnselectedFacts`, currentAllFact)
                            return allUnselectedFacts.concat(currentAllFact);

                        }, []);

                        this.clog.debug(`QTCrud.Component: _initializeExistingQuizTemplate: got a quiz template just fine, resolving with true, template details:`, theQuizTemplate);
                        resolve(true);
                    },
                    (errorDetails) => {

                        this.clog.debug(`QTCrud.Component: _intializeExistingQuizTemplate: Failed to load the QuizTemplate, error details:`, errorDetails);

                        reject({ msg: `QTCrud.Component: Error, failed to retrieve the quiz template, details:`, deails: errorDetails });
                    }
                );

            });
        
        }

        private initializeNewQuizTemplate(): Promise<boolean> {

            return new Promise( (resolve, reject) => {

                this.InputDescription = "";
                this.InputKnowledgeDomains = [];
                this.InputQuizTemplateTitle = "";
                this.AllSelectedFacts = [];

                resolve(true);

            })

        }

        public handleRemoveFactFromTemplate(theFact: FM.IFactItem) {
            //theFact._isDeleted = true;
        }

        private handleAddFactToQuizTemplate(factToAdd: FM.IFactItem) {

            this.AllSelectedFacts = this.AllSelectedFacts.concat(factToAdd);
            this.AllUnselectedFacts = F.filterOutEntityByUniqueID(factToAdd.UniqueID, this.AllUnselectedFacts);

        }

        public isFactSelected(factToCheck: FM.IFactItem): boolean {

            return this.AllSelectedFacts ? this.AllSelectedFacts.some((aSelectedFact) => { return aSelectedFact.UniqueID === factToCheck.UniqueID; }) : false;
        }

        public ping(): void {
            this.quizTemplatesService.ping();
        }

        private returnToQuizTemplateList() {
            this.router.navigate(["/Admin/QuizTemplates"]);
        }

        public handleSave() {

            const QuizTemplateToSave: QTM.QuizTemplateItem = new QTM.QuizTemplateItem();
            const confirmationMsg: string = this.isNewQuizTemplateItem ? "Saved a new QuizTemplate!" : "Updated an existing QuizTemplate!";

            QuizTemplateToSave.Title = this.InputQuizTemplateTitle;
            QuizTemplateToSave.Description = this.InputDescription;
            QuizTemplateToSave.KnowledgeDomains = this.AllKnowledgeDomains;
            QuizTemplateToSave.Facts = [].concat(this.AllSelectedFacts);
            //QuizTemplateToSave.Facts = this.AllFacts.filter((anItem) => { return true; /*!anItem._isDeleted; */});

            if (!this.isNewQuizTemplateItem) {
                QuizTemplateToSave.UniqueID = this.existingQuizTemplateID;
            }

            this.quizTemplatesService.saveQuizTemplate(QuizTemplateToSave);

            // const OKModal = this._modalService.CreateOKModal("Saved QuizTemplate", confirmationMsg).result.then(
            //     (result) => {
            //         this._returnToQuizTemplateList();
            //     }
            // );

        }

        public handleDelete() {

            // const confirmModal = this._modalService.CreateConfirmModal("Confirm Delete", "Are you sure you want to delete this item?");

            // confirmModal.result.then(
            //     (result) => {
            //         if (result) {
            //             this.quizTemplatesService.DeleteQuizTemplateByUniqueID(this.$routeParams.quizTemplateID);
            //             this._returnToQuizTemplateList();
            //         }
            //     }
            // );
        }

        public handleCancel(isFormDirty: boolean) {

            this.returnToQuizTemplateList();

            // if (isFormDirty) {
            //     const confirmModal = this._modalService.CreateConfirmModal("Unsaved Changes", "Warning: You have unsaved changes. Are you sure you want to cancel?");

            //     confirmModal.result.then(
            //         (result) => {
            //             if (result) {
            //                 this._returnToQuizTemplateList();
            //             }
            //         }
            //     );
            // }
            // else {
            //     this._returnToQuizTemplateList();
            // }
        }

        public handleSelectFact(theFact: FM.IFactItem) {
            this.AllSelectedFacts = this.AllSelectedFacts ? this.AllSelectedFacts.concat(theFact): [theFact];

            this.AllUnselectedFacts = F.filterOutEntityByUniqueID(theFact.UniqueID, this.AllSelectedFacts);
        }

        public handleDeselectFact(theFact: FM.IFactItem) {
            this.AllUnselectedFacts = this.AllUnselectedFacts.concat(theFact);

            this.AllSelectedFacts = F.filterOutEntityByUniqueID(theFact.UniqueID, this.AllSelectedFacts);
        }

    }

