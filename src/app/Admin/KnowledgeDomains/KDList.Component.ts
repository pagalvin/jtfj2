import { ViewDebugToggleComponent } from '../../Framework/view-debug-toggle-component/view-debug-toggle.component';
import { Component, OnInit } from '@angular/core';

import { KnowledgeDomainItem } from "./KDItem";
import { KnowledgeDomainsService } from "./KD.Service";

import { ViewDebugToggleService } from "../../Framework/view-debug-toggle-component/view-debug-toggle.service";

@Component({
    selector: 'jtfj-knowledge-domains',
    templateUrl: `./KDList.View.html`,
})
export class KnowledgeDomainsListComponent implements OnInit {

    public get AllKnowledgeDomains(): KnowledgeDomainItem[] {
        return this.knowledgeDomainService.AllKnowledgeDomains;
    }

    public get viewDebug() { return this.viewDebugService.ViewDebugIsEnabled }

    private _isNewKnowledgeDomainItem: boolean = false;

    public InputTitle: string;
    public InputDescription: string;

    constructor(private knowledgeDomainService: KnowledgeDomainsService,
        private viewDebugService: ViewDebugToggleService) {

        console.debug(`KnowledgeDomainListController: ctor: Entering.`);

    } // constructor

    public ngOnInit() {

        this.knowledgeDomainService.getKnowledgeDomains();

    }

    public Ping(): void {
    }

}
