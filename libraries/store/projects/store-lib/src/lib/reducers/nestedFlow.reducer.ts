import { Action, createReducer, on } from "@ngrx/store";
import { NestedFlow } from "../entity";
import * as nestedFlowActions from "../actions";
import * as store from '../state/storage';

export interface State {
    nestedFlow: NestedFlow[];
    result?: any;
    isLoading?: boolean;
    isLoadingSuccess?: boolean;
    isLoadingFailure?: boolean;
}

export const initialState: State = {
    nestedFlow: store.getItem('nestedFlow').nestedFlow || [],
    result: '',
    isLoading: false,
    isLoadingSuccess: false,
    isLoadingFailure: false
}


const nestedFlowReducer = createReducer(
    initialState,
    on(nestedFlowActions.nestedFlowBuild, (state: any, { nestedFlow }:any ) => ({ nestedFlow: state.nestedFlow, isLoading: true})),
    on(nestedFlowActions.nestedFlowBuildSuccess, (state: any, result: any) => ({ nestedFlow: [...state.nestedFlow, result.nestedFlow], isLoading: false, isLoadingSuccess: true}))
);

export function reducer(state: State | undefined, action: Action): any{
    return nestedFlowReducer(state, action);
}

export const getBuildNestedFlow = (state: State) => {
    return {
        nestedFlow: state.nestedFlow,
        isLoadingSuccess: state.isLoadingSuccess
    }
}

export const nestedFlowRegister = (state: State) => {
    return {
        nestedFlow: state.nestedFlow,
        result: state.result,
        isLoading: state.isLoading,
        isLoadingSuccess: state.isLoadingSuccess
    }
}

export const nestedFlowDestroy = (state: State) => {
    return {
        nestedFlow: state.nestedFlow,
        result: state.result,
        isLoading: state.isLoading,
        isLoadingSuccess: state.isLoadingSuccess
    }
}