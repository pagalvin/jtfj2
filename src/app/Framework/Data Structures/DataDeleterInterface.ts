import { ActivityStatus } from './IOActivity';

interface DataDeleter {

    isDeletingData: boolean;
    didDeleteData: boolean;
    wasDeleteError: boolean;
    deleteErrorDetails: any;

    setIsDeletingStatus: () => void;
    setDeleteErrorDetails: (details:any) => void;
    setDeleteSucceeded: () => void;
}

interface DataDeleter2 {
    DeleteStatus: ActivityStatus;
}