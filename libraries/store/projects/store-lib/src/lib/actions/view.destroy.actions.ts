import { createAction, props } from '@ngrx/store';

export const VIEW_DESTROY = '[View Destroy] Build';
export const VIEW_DESTROY_SUCCESS = '[View Destroy] Success';
export const VIEW_DESTROY_FAILURE = '[View Destroy] Failure';

export const viewDestroy = createAction(
    VIEW_DESTROY,
    props<{ name: string }>()
)

export const viewDestroySuccess = createAction(
    VIEW_DESTROY_SUCCESS,
    props<any>()
)

export const viewDestroyFailure = createAction(
    VIEW_DESTROY_FAILURE,
    props<{message: string}>()
)