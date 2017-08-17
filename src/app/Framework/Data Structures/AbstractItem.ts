
    export interface IAbstractItem {
        InternalID: number;
        UniqueID: string;
        DateCreated: Date;
        DateModified: Date;
    }

    export abstract class AbstractItem implements IAbstractItem {

        static NextID: number = 0;

        public UniqueID: string; // Used to keep everything unique.
        public InternalID: number;
        public DateCreated: Date;
        public DateModified: Date;

        constructor() {
            this.InternalID = AbstractItem.NextID++;
            this.DateCreated = null;
            this.DateModified = null;
            this.UniqueID = "";
        }
    }

