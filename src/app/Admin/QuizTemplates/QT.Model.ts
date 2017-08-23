import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { IFactItem } from '../Facts/FactModel';
import { KnowledgeDomainItem } from '../KnowledgeDomains/KDItem';
import { IEntityMetadata } from '../../Framework/Data Structures/IEntityMetadata';

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

        public get EntityMetadata(): () => IEntityMetadata { return QuizTemplateItem.GetEntityMetadata }

        constructor() {
            super();

            this.Title = "";
            this.UniqueID = "";
            this.Description = "";
            this.KnowledgeDomains = [];
            this.Facts = [];
        }

        static deNulled(theItem: QuizTemplateItem): QuizTemplateItem {

            console.info(`QT.Model: deNulled: de-nulling an item, theItem:`, theItem);

            const result = new QuizTemplateItem();
            result.Description = theItem.Description || "";
            result.Title = theItem.Title || "";
            result.UniqueID = theItem.UniqueID || "";
            result.Facts = theItem.Facts || [];
            result.KnowledgeDomains = theItem.KnowledgeDomains || [];

            console.info(`QT.Model: deNulled: denulled item, theItem:`, result);

            return result;

        }

        static GetEntityMetadata(): IEntityMetadata {

            return {
                ConsoleLoggingLabel: "QuizTemplateItem",
                MongoCollectionName: "QuizTemplateItems",
                PropertyNames: AbstractItem.EntityProperties.concat(["Description", "KnowledgeDomains","Facts", "Title"]),
                ApiRouteBaseName: 'QuizTemplate',
                EmptyItem: () => new QuizTemplateItem()
            }
        }

    }

