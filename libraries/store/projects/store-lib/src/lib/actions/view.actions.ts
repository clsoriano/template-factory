import { createAction, props } from '@ngrx/store';

export const VIEW_BUILD = '[View Build] Build';
export const VIEW_BUILD_SUCCESS = '[View Build] Success';
export const VIEW_BUILD_FAILURE = '[View Build] Failure';

export const viewBuild = createAction(
    VIEW_BUILD,
    props<{ server: any }>()
);

export const viewBuildSuccess = createAction(
    VIEW_BUILD_SUCCESS,
    props<any>()
);

export const viewBuildFailure = createAction(
    VIEW_BUILD_FAILURE,
    props<{ message: string }>()
);