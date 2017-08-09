import { Component, OnInit } from '@angular/core';

import { KnowledgeDomainItem } from "./KDItem";
import { KnowledgeDomainsService } from "./KD.Service";

@Component({
    selector: 'jtfj-knowledge-domains',
    templateUrl: `./KDList.View.html`,
})
export class KnowledgeDomainsListComponent implements OnInit {

    public get AllKnowledgeDomains(): KnowledgeDomainItem[] {
        return this.knowledgeDomainService.AllKnowledgeDomains;
    }

    private _isNewKnowledgeDomainItem: boolean = false;

    public InputTitle: string;
    public InputDescription: string;

    constructor(private knowledgeDomainService: KnowledgeDomainsService) {

        console.debug(`KnowledgeDomainListController: ctor: Entering.`);

    } // constructor

    public ngOnInit() {

        this.knowledgeDomainService.getKnowledgeDomains();

    }

    public Ping(): void {
    }

}
