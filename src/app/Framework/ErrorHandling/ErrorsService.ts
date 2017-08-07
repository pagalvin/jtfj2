
import { Injectable } from '@angular/core';
import { AbstractAngularService } from '../Data Structures/AbstractAngularService';
import { ConsoleLog } from '../Logging/ConsoleLogService';

"use strict";

export interface IError {
    _msg: string;
    errorDetails: any[];
}

@Injectable()
export class ErrorsService extends AbstractAngularService {

     constructor (private cLog: ConsoleLog) {

        super();

    }

    public ping() {

    }

    public GetNewError(msg: string, ...errorDetails: any[]) : IError {

        return {
            _msg: msg,
            errorDetails: errorDetails
        }
        
    }

}