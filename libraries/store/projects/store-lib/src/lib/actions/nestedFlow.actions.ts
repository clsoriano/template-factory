import { createAction, props } from '@ngrx/store';

export const NESTED_FLOW_BUILD = '[Nested flow Build] Build';
export const NESTED_FLOW_BUILD_SUCCESS = '[Nested flow Build] Success';
export const NESTED_FLOW_BUILD_FAILURE = '[Nested flow Build] Failure';

export const nestedFlowBuild = createAction(
    NESTED_FLOW_BUILD,
    props<{ server: any }>()
);

export const nestedFlowBuildSuccess = createAction(
    NESTED_FLOW_BUILD_SUCCESS,
    props<any>()
);

export const nestedFlowBuildFailure = createAction(
    NESTED_FLOW_BUILD_FAILURE,
    props<{ message: string }>()
);