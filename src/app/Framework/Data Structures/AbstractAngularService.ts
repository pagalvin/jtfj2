"use strict";

export abstract class AbstractAngularService {

    public IsLoadingData: boolean;
    public WasErrorLoadingData: boolean;
    public ErrorDetails: any;

    constructor() {

        this.IsLoadingData = false;
        this.WasErrorLoadingData = false;
        this.ErrorDetails = null;

    }

    abstract ping(): void;

}
