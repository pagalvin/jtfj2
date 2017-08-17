import { extendConfigurationFile } from 'tslint/lib/configuration';

interface PersistableItem {
    UniqueID;
}

export interface DataServiceInterface {
    saveItem<T extends PersistableItem>();
    getItems<T extends PersistableItem>(): Promise<T[]>
    deleteItem<T extends PersistableItem>();
    getItemByID<T extends PersistableItem>(forUniqueID: string): Promise<T>;
    getItem<T extends PersistableItem>(forPredicate: any): Promise<T>;
    getItems<T extends PersistableItem>(forPredicate: any): Promise<T[]>;
}

export interface IDataServiceFactory {

}