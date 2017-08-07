import { ActivityStatusTracker } from './IOActivity';

export abstract class AbstractCrudComponent {

    protected deleteStatus: ActivityStatusTracker;
    protected saveStatus: ActivityStatusTracker;
    protected readStatus: ActivityStatusTracker;

    constructor() {
        this.deleteStatus = new ActivityStatusTracker();
        this.saveStatus = new ActivityStatusTracker();
        this.readStatus = new ActivityStatusTracker();
    }

    protected async saveItem<T>(saveLogic: () => Promise<any>) {

        // set is saving flags

        try {
            this.saveStatus.setIsInProcess();
            await saveLogic(); // do the pre-work
            this.saveStatus.setDidSucceed();
        }
        catch (someError) {
            this.saveStatus.setDidFail(someError);
        }
    }

}

