import * as Entities from "../Data Structures/AbstractItem";
import * as CustomErrors from "../ErrorHandling/ErrorsService";

export class Functionals {

    static stringArrayToCdl(stringArr: string[]): string {

        return stringArr.reduce((prev: string, curr: string) => {

            const toAppend = curr ? curr : "";

            if (prev.length > 0) {
                return toAppend + ", " + prev;
            }

            return toAppend;

        }, "");

    }

    static idHighWaterMark(fromArray: Entities.AbstractItem[]) {
        return fromArray.reduce((prev: number, curr: Entities.AbstractItem) => { return curr.InternalID > prev ? curr.InternalID : prev }, 0);
    }

    static entityIsInCollection(collection: Entities.AbstractItem[], testID: string) {
        return collection ? collection.some((anItem) => { return anItem.UniqueID === testID; }): false;
    }

    static getFirstEntityByInternalID<T extends Entities.IAbstractItem>(forID: number, entityCollection: T[]): T {
        return entityCollection.filter((anEntity) => {
            return anEntity.InternalID === forID;
        })[0];
    }

    static getEntityByUniqueID<T extends Entities.IAbstractItem>(forID: string, entityCollection: T[]): T {

        if (!entityCollection) {
            throw ("Functionals: getEntityByUniqueID: Error: entityCollect is null or undefined.");
        }

        const foundEntities = entityCollection.filter((anEntity) => {
            return anEntity.UniqueID === forID;
        });

        if (foundEntities.length > 0) {
            return foundEntities[0];
        }

        throw {
            msg: `Functionals: getEntityByUniqueID: ERROR: Failed to retrieve an entity with ID [${forID}]`,
            fullCollection: entityCollection
        };

    }

    static filterOutEntityByUniqueID<T extends Entities.IAbstractItem>(forID: string, entityCollection: T[]): T[] {
        return entityCollection.filter((anEntity) => {
            return anEntity.UniqueID != forID;
        });
    }

    static IsNullOrUndefined<T>(value: T) {
        return value ? false : true;
    }

    static isIDAssigned<T extends Entities.IAbstractItem>(ItemToTest: T): boolean {

        console.debug(`Functions.ts: IsIDAssigsned: Testing an item:`, { itm: ItemToTest });

        if (Functionals.IsNullOrUndefined(ItemToTest.UniqueID)) {
            console.debug(`Functions.ts: IsIDAssigsned: False.`);
            return false;
        }

        if (ItemToTest.UniqueID.length > 0) {
            console.debug(`Functionalss.ts: IsIDAssigsned: True.`);
            return true;
        }

        console.debug(`Functions.ts: IsIDAssigsned: False.`);
        return false;

    }

    static getMergedCollection<T extends Entities.IAbstractItem>(collection: T[], mergeItem: T): T[] {

        if (Functionals.entityIsInCollection(collection, mergeItem.UniqueID)) {
            console.log(`Functionals: mergeEntityIntoCollection: will replace the entity:`, mergeItem);
            collection = collection.map((aCollectionItem) => {
                if (aCollectionItem.UniqueID === mergeItem.UniqueID) {
                    return mergeItem;
                }
                return aCollectionItem;
            });
        }
        else {
            collection = collection.concat(mergeItem);
        }

        return collection;

    }

    /**
     * Takes an array and returns a new array that is a shuffled / randomized version of the source.
     * Inspired by: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array (Durstenfeld shuffle)
     * @param source Source array. It is not modified by this operation.
     */
    static getShuffledArray<T>(source: T[]): T[] {

        const result = [].concat(source);

        for (var i = result.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }

        return result;
    }

    /**
     * For a given collection (array of objects), it will return an array of values for a specific column.
     * For example: "Knowledge Domain" is a complex object and you have an array of them. You want to extract all of
     * the columns labeled "Title". You would do: result = extractFieldsFromCollection<string[]>(myKnowledgeDomains, "Title");
     * @param collection: The array from which you wish to extract data.
     * @param forColumn: The name of the column as a string.
     */
    static extractFieldsFromCollection<T extends any[]>(collection: any[], forColumn: string): T {

        // console.debug(`Functionals: extractFieldsFromCollection: extracting column "${forColumn}" from collection:`, collection);

        if (!collection) {
            return <T>[];
        };

        if (collection.length < 1) {
            return <T>[];
        }

        try {
            if (!collection[0][forColumn]) { }
        }
        catch (exception) {
            throw Functionals.getNewError(`extractFieldsFromCollection: Could not find column "${forColumn}" in the source collection:`, collection);

        }

        return collection.reduce((prev: T[], curr: any) => {

            const fval = curr[forColumn] ? curr[forColumn] : "";

            return prev.concat(curr[forColumn]);
        }, []);
    }

    static getNewError(msg: string, ...errorDetails: any[])  {

        return {
            _msg: msg,
            errorDetails: errorDetails
        }
        
    }

}
