import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { IEntityMetadata } from '../../Framework/Data Structures/IEntityMetadata';

export class KnowledgeDomainItem extends AbstractItem implements IAbstractItem {

    public Title: string;
    public Description: string;
    public get EntityMetadata(): () => IEntityMetadata { return KnowledgeDomainItem.GetEntityMetadata }
    //public EntityMetadata = KnowledgeDomainItem.GetEntityMetadata;

    constructor() {
        super();
    }

    static randomItem(): KnowledgeDomainItem {
        const result = new KnowledgeDomainItem();

        result.Title = "random";// chance.sentence();
        result.Description = "random" //chance.paragraph();


        return result;
    }

    static GetEntityMetadata(): IEntityMetadata {

        return {
            ConsoleLoggingLabel: "KnowledgeDomainItem",
            MongoCollectionName: "KnowledgeDomains",
            PropertyNames: AbstractItem.EntityProperties.concat(["Title","Description"]),
            ApiRouteBaseName: 'KnowledgeDomain',
            EmptyItem: () => {
                const result = new KnowledgeDomainItem();
                result.DateCreated = new Date();
                result.DateModified = new Date();
                result.Description = "";
                result.Title = "";
                return result;
            }
        }

    }
}

