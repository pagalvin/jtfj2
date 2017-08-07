 
import { LogInterface } from './LogInterface';
import { Injectable } from '@angular/core';

@Injectable()
export class ConsoleLog implements LogInterface {
    
    public debug(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage("debug", msg, supportingDetails);
    }

    public info(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage("info", msg, supportingDetails);
    }

    public warn(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage("warn", msg, supportingDetails);
    }

    public error(msg: string, ...supportingDetails: any[]): void {
        this.emitLogMessage("error", msg, supportingDetails);
        throw {msg: msg, supportingDetails: supportingDetails};
    }

    private emitLogMessage(msgType: "debug" | "info" | "warn" | "error", msg: string, supportingDetails: any[]) {
      
        // These various ways of calling the console just help with formatting messages.
        // If the supporting detail is a single item array, its easier to view and manage in Chrome (at least) 
        // if it's emitted directly rather than wrapped in an array containing a single item.
        if (supportingDetails.length > 0) {
            if (supportingDetails.length === 1) {
            console[msgType].call(this, msg, supportingDetails[0]);
        }
        else {
            console[msgType].call(this, msg, supportingDetails);
        }
        }
        else {
            console[msgType].call(this,msg);
        }

    }
}

