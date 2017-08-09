import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { IFactItem } from '../Facts/FactModel';
import { KnowledgeDomainItem } from '../KnowledgeDomains/KDItem';

    export interface IQuizTemplateItem extends IAbstractItem{
        Title: string;
        Description: string;
        KnowledgeDomains: KnowledgeDomainItem[];
        Facts: IFactItem[];
    }

    export class QuizTemplateItem extends AbstractItem implements IQuizTemplateItem{

        public Title: string;
        public Description: string;
        public KnowledgeDomains: KnowledgeDomainItem[];
        public Facts: IFactItem[];

        constructor() {
            super();

            this.Title = "";
            this.UniqueID = "";
            this.Description = "";
            this.KnowledgeDomains = [];
            this.Facts = [];
        }

        static initializeNulls(theItem: QuizTemplateItem): QuizTemplateItem {

            const result = new QuizTemplateItem();
            result.Description = theItem.Description || "";
            result.Title = theItem.Title || "";
            result.UniqueID = theItem.UniqueID || "";
            result.Facts = theItem.Facts || [];
            result.KnowledgeDomains = theItem.KnowledgeDomains || [];

            return result;

        }

    }

