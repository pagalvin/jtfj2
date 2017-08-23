import { AbstractItem, IAbstractItem } from "../../Framework/Data Structures/AbstractItem";
import * as KDM from "../../Admin/KnowledgeDomains/KDItem";
import * as FM from "../../Admin/Facts/FactModel";
import { IEntityMetadata } from '../../Framework/Data Structures/IEntityMetadata';

export interface IQuizInstanceItem extends IAbstractItem {
    Title: string;
    Description: string;
    KnowledgeDomains: KDM.KnowledgeDomainItem[];
    Facts: FM.IFactItem[];
}

export class QuizInstanceItem extends AbstractItem implements IQuizInstanceItem {

    public Title: string;
    public Description: string;
    public KnowledgeDomains: KDM.KnowledgeDomainItem[];
    public Facts: FM.IFactItem[];

    public get EntityMetadata(): () => IEntityMetadata { return QuizInstanceItem.GetEntityMetadata }

    constructor() {
        super();

        this.Title = "";
        this.UniqueID = "";
        this.Description = "";
        this.KnowledgeDomains = [];
        this.Facts = [];
    }

    static MakeSafe(item: QuizInstanceItem): QuizInstanceItem {

        const result = new QuizInstanceItem();
        result.Description = item.Description || "";
        result.Title = item.Title || "";
        result.UniqueID = item.UniqueID || "";
        result.Facts = item.Facts || [];
        result.KnowledgeDomains = item.KnowledgeDomains || [];

        return result;

    }

    static GetEntityMetadata(): IEntityMetadata {

            return {
                ConsoleLoggingLabel: "QuizInstanceItem",
                MongoCollectionName: "QuizInstanceItems",
                PropertyNames: AbstractItem.EntityProperties.concat(["Title","Description","KnowledgeDomains","Facts"]),
                ApiRouteBaseName: 'QuizInstance',
                EmptyItem: () => { return new QuizInstanceItem(); }
            }
        }
}
