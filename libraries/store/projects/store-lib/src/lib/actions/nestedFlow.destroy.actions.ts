import { createAction, props } from '@ngrx/store';

export const NESTED_FLOW_DESTROY = '[Nested Flow Destroy] Build';
export const NESTED_FLOW_DESTROY_SUCCESS = '[Nested Flow Destroy] Success';
export const NESTED_FLOW_DESTROY_FAILURE = '[Nested Flow Destroy] Failure';

export const nestedFlowDestroy = createAction(
    NESTED_FLOW_DESTROY,
    props<{ name: string }>()
)

export const nestedFlowDestroySuccess = createAction(
    NESTED_FLOW_DESTROY_SUCCESS,
    props<any>()
)

export const nestedFlowDestroyFailure = createAction(
    NESTED_FLOW_DESTROY_FAILURE,
    props<{message: string}>()
)