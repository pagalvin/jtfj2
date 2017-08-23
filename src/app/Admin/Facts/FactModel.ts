import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { KnowledgeDomainItem } from '../KnowledgeDomains/KDItem';
import { IEntityMetadata } from '../../Framework/Data Structures/IEntityMetadata';

    export interface IWrongAnswer {
        WrongAnswer: string;
        TruthAffinity: number;
        _isEditing: boolean; // Used by the UI.
        _isDeleted: boolean; // Used by the UI as well.
    }

    export interface ICorrectAnswer {
        CorrectAnswer: string;
        _isEditing: boolean; // Used by the UI.
        _isDeleted: boolean; // Used by the UI as well.
    }

    export interface IQuestion { 
        Question: string;
        _isEditing: boolean; // Used by the UI.
        _isDeleted: boolean; // Used by the UI as well.
    }

    export interface IFactItem extends IAbstractItem {
        FactID: number;
        FactStatement: string;
        Description: string;
        Questions: IQuestion[];
        KnowledgeDomains: KnowledgeDomainItem[];
        CorrectAnswers: ICorrectAnswer[];
        WrongAnswers: IWrongAnswer[];
    }

    export class FactItem extends AbstractItem implements IFactItem {

        public FactID: number;
        public FactStatement: string;
        public Description: string;
        public KnowledgeDomains: KnowledgeDomainItem[];
        public Questions: IQuestion[];
        public CorrectAnswers: ICorrectAnswer[];
        public WrongAnswers: IWrongAnswer[];

        public get EntityMetadata(): () => IEntityMetadata { return FactItem.GetEntityMetadata }

        constructor() {
            super();

            this.UniqueID = "";
            this.CorrectAnswers = [];
            this.Description = "";
            this.FactID = 0;
            this.KnowledgeDomains = [];
            this.FactStatement = "";
            this.WrongAnswers = [];

        }

        static cleanNulls(factItem: FactItem): FactItem {

            const result = new FactItem();
            result.CorrectAnswers = factItem.CorrectAnswers || [];
            result.Description = factItem.Description || "";
            result.FactID = factItem.FactID || 0;
            result.KnowledgeDomains = factItem.KnowledgeDomains || [];
            result.Questions = factItem.Questions || [];
            result.WrongAnswers = factItem.WrongAnswers || [];
            result.FactStatement = factItem.FactStatement || "";
            result.UniqueID = factItem.UniqueID || "";

            return result;

        }

        static GetEntityMetadata(): IEntityMetadata {

            return {
                ConsoleLoggingLabel: "Fact",
                MongoCollectionName: "Facts",
                PropertyNames: AbstractItem.EntityProperties.concat(["FactStatement","CorrectAnswers","Description","FactID","KnowledgeDomains","WrongAnswers", "Questions"]),
                ApiRouteBaseName: 'Fact',
                EmptyItem: () => new FactItem()
            }
        }

}