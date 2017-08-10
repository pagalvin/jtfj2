import { Component, OnInit } from '@angular/core';

import { FactItem } from "./FactModel";
import { FactsService } from "../Facts/Facts.Service";
import { Functionals as F } from "../../Framework/Util/Functionals";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";
import { KnowledgeDomainItem } from "../KnowledgeDomains/KDItem";
import { KnowledgeDomainsService} from "../KnowledgeDomains/KD.Service";
import { ViewDebugToggleService } from "../../Framework/view-debug-toggle-component/view-debug-toggle.service";
import * as CustomErrors from "../../Framework/ErrorHandling/ErrorsService";

@Component({
    selector: 'jtfj-facts-list',
    templateUrl: `./FactsList.View.html`,
})
export class FactsListComponent implements OnInit {

    public get AllFacts() { return this.factsService.AllFacts; }
    public get viewDebug() { return this.viewDebugService.ViewDebugIsEnabled }
    
    constructor(
        private factsService: FactsService,
        private kdService: KnowledgeDomainsService,
        private clog: ConsoleLog,
        private viewDebugService: ViewDebugToggleService) {

        this.clog.debug(`KnowledgeDomainListController: ctor: Entering.`);

    } // constructor

    public ngOnInit() {
        this.factsService.loadAllFacts();
    }

    public getFriendlyKDDisplay(forFact: FactItem): string {

        return "test";

        // const forDomains: KnowledgeDomainItem[] = forFact.KnowledgeDomains;

        // if (! forDomains) { 
        //     return "error"; 
        // }

        // this.clog.debug(`FactsList.component: getFriendlyKDDisplay: entering, forDomains:`, forDomains);
        
        // try {
        //     const result = F.stringArrayToCdl(F.extractFieldsFromCollection<string[]>(forDomains, "Title"));
        //     // this.clog.debug(`FactsListComponent: getFriendlyKDDisplay: got a view of knowledge domains:`, result);
        //     return result;
        // }
        // catch (ex) {
        //     this.clog.error("FactsList.component: getFriendlyKDDisplay: failed to get domains, details:", ex);
        //     return "error";
        //     // throw (<CustomErrors.IError>ex)._msg;
        // }
    }

}
