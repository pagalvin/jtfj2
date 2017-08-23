
import { IEntityMetadata } from './IEntityMetadata';

export interface IAbstractItem {
    InternalID: number;
    UniqueID: string;
    DateCreated: Date;
    DateModified: Date;
    EntityMetadata: () => IEntityMetadata;
}

export abstract class AbstractItem implements IAbstractItem {

    static NextID: number = 0;

    public UniqueID: string; // Used to keep everything unique.
    public InternalID: number;
    public DateCreated: Date;
    public DateModified: Date;

    abstract EntityMetadata;

    constructor() {
        this.InternalID = AbstractItem.NextID++;
        this.DateCreated = null;
        this.DateModified = null;
        this.UniqueID = "";
    }

    static EntityProperties = ["UniqueID", "InternalID", "DataCreated", "DateModified"];

}

