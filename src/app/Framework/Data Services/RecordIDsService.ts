"use strict";
import { AbstractAngularService } from '../Data Structures/AbstractAngularService';
import { ConsoleLog } from '../Logging/ConsoleLogService';
import { UserService } from '../Users/UserService';

import { Injectable } from '@angular/core';


@Injectable()
export class RecordIDsService extends AbstractAngularService {

    private localStorageKeySeed: string = "JTFJ.IDs.";

    //private _loadAllRecordIDsPromise: Promise<boolean>;

    constructor(private userService: UserService,
        private clog: ConsoleLog) {

        super();

    }

    public ping() {
        this.clog.debug(`RecordIDsService: got a ping, pinging your right back.`);
    }

    public async getUniqueID(): Promise<string> {

        this.clog.debug(`RecordsIDService: GetUniqueID: Entering.`);

        await this.userService.ensureCurrentUser();

        return new Promise<string>((resolve, reject) => {

            this.clog.debug(`RecordsIDService: GetUniqueID: Got the current user, determining next ID.`);

            const thisStorageKey = this.localStorageKeySeed + this.userService.CurrentUser.UserID;

            const nextNumericPortion: number = parseInt(localStorage.getItem(thisStorageKey));
            const saveKey: number = nextNumericPortion ? nextNumericPortion + 1 : 1;
            const returnKey = this.userService.CurrentUser.UserID + "_" + saveKey.toString();

            localStorage.setItem(thisStorageKey, saveKey.toString());

            resolve(returnKey);

        });

    }
}

