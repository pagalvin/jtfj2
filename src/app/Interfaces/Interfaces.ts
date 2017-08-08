
    export type LanguageType = "English" | "Spanish";

    export interface IFact {

        ID: number;
        Categories: IFactCategories;
        TrueStatements: IStatement[];
        Falsehoods: IFalsehood[];
        StudyResources: IStudyResource[];
    }

    export interface IFactCategories {
        Categories: string[];
    }

    export interface IStatement {
        ID: number;
        Language: LanguageType;
        Statement: string;
    }

    export interface IStudyResource {
        ID: number;
        Title: string;
        Description: string;
        Url: string;
    }

    export interface IStudyResources {
        Resources: IStudyResource[];
    }

    export interface IFalsehood {
        ID: number;
        Affinity: number;
        FalseStatements: IStatement[];
    }

    export interface IQuestion {
        ID: number;
        QuestionText: string;
        Language: LanguageType;
    }

    export interface IAcceptableAnswer {
        language: LanguageType;
        Answer: string;
    }

    // FITB = "Fill in the blank"
    export interface IFITBQ {
        ID: number;
        Questions: IQuestion[];
        AcceptableAnswers: IAcceptableAnswer[];
    }

