import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Functionals as F } from "../../Framework/Util/Functionals";
import * as FM from '../../Admin/Facts/FactModel';
import { FactsService } from '../../Admin/Facts/Facts.Service';
import * as QTM from '../../admin/QuizTemplates/QT.Model';
import { QuizTemplatesService } from '../../Admin/QuizTemplates/QT.Service';
import { ConsoleLog } from '../../Framework/Logging/ConsoleLogService';
import * as QIM from './QIModel';

interface qiParameters {
    totalQuestions: number;
    difficulty: number;
}

interface qiRouteParameters {
    quizTemplateID: string;
}

interface IQAPair {
    question: FM.IQuestion;
    Answers: FM.ICorrectAnswer[];
    WrongAnswers: FM.IWrongAnswer[];
}

interface IQuizQuestionChoiceSet {
    Response: string;
    IsCorrect: boolean;
    WasSelectedByUser: boolean;
}
interface IQuizQuestion {
    Question: string;
    AllChoices: IQuizQuestionChoiceSet[]
}


@Component({
    templateUrl: './QI.View.html',
    selector: 'jtfj-qi-crud-component'
})
export class QICrudComponent {

    private _quizTemplate: QTM.QuizTemplateItem; // populated by constructor using $routeParams value

    private _quizInstance: QIM.QuizInstanceItem;
    private _quizParameters: qiParameters;

    private _allQuizQuestions: IQuizQuestion[] = [];
    public get AllQuizQuestions() { return this._allQuizQuestions; }

    private _currentQuizQuestion: IQuizQuestion;
    public get CurrentQuizQuestion() { return this._currentQuizQuestion; }

    private _currentQuizQuestionIndex: number = 0;
    public get CurrentQuizQuestionIndex() { return this._currentQuizQuestionIndex; }

    private _quizTemplatePromise: Promise<QTM.IQuizTemplateItem>;

    private routeParamsSubscription: Subscription;

    public IsQuizReady: boolean = false;
    public IsQuizLoading: boolean = true;
    public WasErrorLoadingQuiz: boolean = false;
    public ErrorLoadingDetails: any;

    constructor(private clog: ConsoleLog,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private _quizTemplatesService: QuizTemplatesService,
        private _factsService: FactsService
    ) {


        // this._quizTemplatePromise = this._quizTemplatesService.getQuizTemplateByUniqueID(this.$routeParams.quizTemplateID);

        // this._initializeQuizInstance({
        //     totalQuestions: 10, difficulty: 99
        // });

    } // constructor

    private _initializeQuizInstance(quizParams: qiParameters) {

        this.clog.debug(`QICrudComponent: _initializeQuizInstance: Entering.`);

        this.IsQuizLoading = true;
        this.IsQuizReady = false;
        this.WasErrorLoadingQuiz = false;

        // to initialize this, we need to go through the template and pick out a number of questions to ask

        this._quizTemplatePromise.then(
            (result) => {
                this._quizTemplate = result;

                this._allQuizQuestions = this._createRandomizedQuiz(quizParams);

                this._currentQuizQuestion = this._allQuizQuestions[0];
                this._currentQuizQuestionIndex = 0;

                this.clog.debug(`QI.Crud.Component: _initializeQuizInstance: random questions:`, this._createRandomizedQuiz(quizParams));
                this.clog.debug(`QI.Crud.Component: _initializeQuizInstance: current question:`, this._currentQuizQuestion);

                this.IsQuizLoading = false;
                this.IsQuizReady = true;
                this.WasErrorLoadingQuiz = false;

            },
            (errorDetails) => {
                this.clog.error(`QI.Crud.component: _initializeQuizInstance: quiz template promise failed, details:`, errorDetails);
                this.IsQuizLoading = false;
                this.IsQuizReady = false;
                this.WasErrorLoadingQuiz = true;
                this.ErrorLoadingDetails = errorDetails;
            }
        );

    }

    public ngOnInit() {

        this.clog.debug(`QICrud.Component: ngOnInit: Entering.`);

        try {
            this.routeParamsSubscription = this.activatedRoute.params.subscribe(async params => {

                this.clog.debug(`QICrud.Component: ngOnInit: got params:`, params)

                this._quizTemplatePromise = this._quizTemplatesService.getQuizTemplateByUniqueID(params.quizTemplateID);

                this.clog.debug(`QICrud.Component: ngOnInit: got a quiz template, initializing.`)
                
                this._initializeQuizInstance({
                    totalQuestions: 10, difficulty: 99
                });

                this.clog.debug(`QICrud.Component: ngOnInit: finished initializing quiz instance, all questions:`, this.AllQuizQuestions);

                
            });
        }
        catch (initializationException) {
            this.clog.error(`QICrud.Component: Error: Failed to initialize due to exception:`, initializationException);
            // throw this.errorsService.GetNewError(`FactCrud.Component: Error: Failed to initialize due to exception.`, initializationException);
        }

    }


    public HandleNextQuestion(): void {

        this._currentQuizQuestionIndex += 1;

        if (this._currentQuizQuestionIndex > this._allQuizQuestions.length) {
            this._currentQuizQuestionIndex = this._allQuizQuestions.length;
            return;
        }

        this._currentQuizQuestion = this._allQuizQuestions[this._currentQuizQuestionIndex];

    }

    public HandlePreviousQuestion(): void {

        this._currentQuizQuestionIndex -= 1;

        if (this._currentQuizQuestionIndex < 0) {
            this._currentQuizQuestionIndex = 0;
            return;
        }

        this._currentQuizQuestion = this._allQuizQuestions[this._currentQuizQuestionIndex];

    }

    private _createRandomizedQuiz(quizParams: qiParameters): IQuizQuestion[] {

        // Build a pool of all the available questions and answers
        const qaPool = this._quizTemplate.Facts.reduce((allQAPairs: IQAPair[], aFact: FM.IFactItem) => {
            const results = aFact.Questions.map((aQuestion) => {
                return <IQAPair>{
                    question: aQuestion,
                    Answers: F.getShuffledArray(aFact.CorrectAnswers),
                    WrongAnswers: F.getShuffledArray(aFact.WrongAnswers)
                };
            });

            return allQAPairs.concat(results);

        }, [])

        const selectedQuestions = F.getShuffledArray(qaPool).slice(0, quizParams.totalQuestions);

        const finalizedQuizQuestions = selectedQuestions.map((aSelectedQuestion) => {
            return <IQuizQuestion>{
                Question: aSelectedQuestion.question.Question,
                AllChoices: F.getShuffledArray([].concat(
                    <IQuizQuestionChoiceSet>{
                        IsCorrect: true,
                        Response: aSelectedQuestion.Answers[0].CorrectAnswer,
                        WasSelectedByUser: false
                    }).
                    concat(aSelectedQuestion.WrongAnswers.map(
                        (aWrongAnswer) => {
                            return <IQuizQuestionChoiceSet>{
                                Response: aWrongAnswer.WrongAnswer,
                                IsCorrect: false,
                                WasSelectedByUser: false
                            }
                        })))
            }
        });

        return finalizedQuizQuestions;
    }

    public Ping(): void {
        this.clog.debug(`QI.Crud.Component: Ping: Ping!`);
        this._quizTemplatesService.ping();
    }

    private _returnToQuizInstanceList() {

        //this.$location.path("/Admin/QuizInstances");
    }


}

