import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { KnowledgeDomainItem } from '../KnowledgeDomains/KDItem';

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

        constructor() {
            super();

            this.FactStatement = "";
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

        // static CreateRandomFact(): FactItem {

        //     const result = new FactItem();

        //     result.Description = chance.sentence();
        //     result.FactStatement = chance.sentence();
        //     result.KnowledgeDomains = ["Presidents"];
        //     result.WrongAnswers = _.range(chance.integer({ min: 1, max: 5 })).map(() => {
        //         return <IWrongAnswer>{
        //             WrongAnswer: "false: " + chance.sentence(), TruthAffinity: chance.integer({ min: 0, max: 99 })
        //         }
        //     });

        //     return result;

        // }
    

    }