
export interface ActivityStatus {
    isInProcess: boolean;
    didSucceed: boolean;
    didFail: boolean;
    errorDetails: boolean;

    setIsInProcess: () => void;
    setDidSucceed: () => void;
    setDidFail: (reason: any) => void;
    setInactive: () => void;
}

export class ActivityStatusTracker implements ActivityStatus {

    public isInProcess: boolean;
    public didSucceed: boolean;
    public didFail: boolean;
    public errorDetails: boolean;

    constructor() { 
        this.setInactive();
    }

    public setIsInProcess() { 
        this.isInProcess = true;
        this.didFail = undefined;
        this.didSucceed = undefined;
        this.errorDetails = undefined;
    }

    public setDidSucceed() {
        this.isInProcess = false;
        this.didFail = false;
        this.didSucceed = true;
        this.errorDetails = null;
    }

    public setDidFail(reason: any) {
        this.isInProcess = false;
        this.didFail = true;
        this.didSucceed = false;
        this.errorDetails = reason;
    }

    public setInactive() {
        this.isInProcess = false;
        this.didFail = undefined;
        this.didSucceed = undefined;
        this.errorDetails = undefined;
    }
}