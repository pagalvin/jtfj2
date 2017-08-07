import { AbstractItem } from '../Data Structures/AbstractItem';


    export interface IUser {
        UserID: string;
        Name: string;
    }

    export class User extends AbstractItem implements IUser {

        public UserID: string;
        public Name: string;

        constructor() {
            super();
        }

    }
