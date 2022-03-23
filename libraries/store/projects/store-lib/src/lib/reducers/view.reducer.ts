import { Action, createReducer, on } from "@ngrx/store";
import * as viewActions from "../actions";
import { View } from "../entity";
import * as storage from '../state/storage';

export interface State {
    view: View;
    result?: any;
    isLoading?: boolean;
    isLoadingSuccess?: boolean;
    isLoadingFailure?: boolean;
}

export const initialState: State = {
    view: storage.getItem('view').view,
    result: '',
    isLoading: false,
    isLoadingSuccess: false,
    isLoadingFailure: false
}

const viewReducer = createReducer(
    initialState,
    on(viewActions.viewBuild, (state: any, { view }:any ) => ({ view, isLoading: true})),
    on(viewActions.viewBuildSuccess, (state: any, result: any) => ({ view: result.view, isLoading: false, isLoadingSuccess: true}))
);

export function reducer(state: State | undefined, action: Action): any{
    return viewReducer(state, action);
}

export const getBuildView = (state: State) => {
    return {
        view: state.view,
        isLoadingSuccess: state.isLoadingSuccess
    }
}

export const viewRegister = (state: State) => {
    return {
        view: state.view,
        result: state.result,
        isLoading: state.isLoading,
        isLoadingSuccess: state.isLoadingSuccess
    }
}

export const viewDestroy = (state: State) => {
    return {
        view: state.view,
        result: state.result,
        isLoading: state.isLoading,
        isLoadingSuccess: state.isLoadingSuccess
    }
}