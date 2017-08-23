import { AbstractItem, IAbstractItem } from '../../Framework/Data Structures/AbstractItem';
import { IEntityMetadata } from '../../Framework/Data Structures/IEntityMetadata';

export interface IUser {
    UserID: string;
    Name: string;
}

export class User extends AbstractItem implements IUser {

    public UserID: string;
    public Name: string;
    public get EntityMetadata(): () => IEntityMetadata { return User.GetEntityMetadata }

    constructor() {
        super();

        this.UserID = "";
        this.Name = "";

    }

    static GetEntityMetadata(): IEntityMetadata {

        return {
            ConsoleLoggingLabel: "User",
            MongoCollectionName: "Users",
            PropertyNames: AbstractItem.EntityProperties.concat(["UserID", "Name"]),
            ApiRouteBaseName: 'User',
            EmptyItem: () => new User()
        }

    }

}