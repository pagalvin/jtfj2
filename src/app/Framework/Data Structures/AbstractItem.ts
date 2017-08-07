
    export interface IAbstractItem {
        InternalID: number;
        UniqueID: string;
    }

    export abstract class AbstractItem implements IAbstractItem {

        static NextID: number = 0;

        public UniqueID: string; // Used to keep everything unique.
        public InternalID: number;

        constructor() {
            this.InternalID = AbstractItem.NextID++;
        }
    }

