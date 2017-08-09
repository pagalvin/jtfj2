import { Component, OnInit } from '@angular/core';
import { Functionals } from "../../Framework/Util/Functionals";
import { QuizTemplatesService } from "./QT.Service";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import * as KDM from "../KnowledgeDomains/KDItem";

@Component({
    selector: 'jtfj-quiz-templates',
    templateUrl: `./QTList.View.html`,
})
export class QuizTemplatesListComponent {

    public get AllQuizTemplates() { return this.quizTemplatesService.AllQuizTemplates; }

    constructor(private clog: ConsoleLog,
        private quizTemplatesService: QuizTemplatesService) {

        this.clog.debug(`QuizTemplatesController: ctor: Entering.`);

        this.quizTemplatesService.LoadAll().then(
            (results) => {
                this.clog.debug(`ListQuizTemplateController: Loaded quiz templates:`, this.AllQuizTemplates);
            },
            (errorDetails) => {
            }
        );

    } // constructor

    public Ping(): void {
        this.quizTemplatesService.ping();
    }

    /**
     * Returns a comma delimited list of knowledge domains suitable for rendering on the UI.
     * @param forDomains: array of knowledge domain items.
     */
    public GetFriendlyKDDisplay(forDomains: string[]) {

        return Functionals.stringArrayToCdl(Functionals.extractFieldsFromCollection<string[]>(forDomains, "Title"));

        // return Functionals.stringArrayToCdl(forDomains);
    }
}

