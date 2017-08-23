export interface IEntityMetadata {
    PropertyNames: string[];
    EmptyItem: () => Object;
    ConsoleLoggingLabel: string;
    ApiRouteBaseName: string;
    MongoCollectionName: string;
}