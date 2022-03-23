import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from "@ngrx/store";
import { localStorageSync } from "ngrx-store-localstorage";
import * as fromView from './reducers/view.reducer';
import * as fromNestedFlow from './reducers/nestedFlow.reducer';

export interface State {
    view: fromView.State,
    nestedFlow: fromNestedFlow.State
}

export const reducers: ActionReducerMap<State> = {
    view: fromView.reducer,
    nestedFlow: fromNestedFlow.reducer
}

const reducerkeys = ['view', 'nestedFlow'];

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
    return localStorageSync({ keys: reducerkeys })(reducer);
}

// log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
    return function(state, action) {
        console.log('state', state);
        console.log('action', action);

        return reducer(state, action);
    }
}

/* export const metaReducers: MetaReducer<State>[] = !environments.production ? [debug, localStorageSyncReducer] : [localStorageSyncReducer]; */
export const metaReducers: MetaReducer<State>[] = [localStorageSyncReducer];

// Register reducer view
export const getViewState = createFeatureSelector<fromView.State>('view');

export const getBuildView = createSelector(
    getViewState,
    fromView.getBuildView
);

export const viewRegister = createSelector(
    getViewState,
    fromView.viewRegister
);

export const viewDestroySelector = createSelector(
    getViewState,
    fromView.viewDestroy
);

/**
 * // Todo reducers Begin

export const geTodoState = createFeatureSelector<fromTodo.State>('todo');

export const getTasks = createSelector(
  geTodoState,
  fromTodo.getTasks
);
 */


// Register reducer nestedFlow

export const getNestedFlowState = createFeatureSelector<fromNestedFlow.State>('nestedFlow');

export const getBuildNestedFlow = createSelector(
    getNestedFlowState,
    fromNestedFlow.getBuildNestedFlow
);

export const nestedFlowRegister = createSelector(
    getNestedFlowState,
    fromNestedFlow.nestedFlowRegister
);

export const nestedFlowDestroySelector = createSelector(
    getNestedFlowState,
    fromNestedFlow.nestedFlowDestroy
);

export const getNestedFlowByName = (props: { name: string | undefined }) =>
    createSelector(
        getNestedFlowState,
        (state) => {
            console.log(state);
            return {
                nestedFlow: state.nestedFlow?.find((x: any) => x.name === props.name),
                isLoadingSuccess: state.isLoadingSuccess
            }
        }
    );

// Action exports
