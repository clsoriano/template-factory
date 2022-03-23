import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { exhaustMap, map, catchError, of } from "rxjs";
import * as nestedFlowActions from "../actions";
import { HTTP_CLIENT_SERVICE } from "../http-client.di";
import { HttpClientService } from "../http-client.interface";

@Injectable()
export class NestedFlowEffects {

    constructor(
        private actions$: Actions,
        @Inject(HTTP_CLIENT_SERVICE) private httpClient: HttpClientService
    ) { }

    viewBuild = createEffect(
        () =>
            this.actions$.pipe(
                ofType(nestedFlowActions.nestedFlowBuild),
                exhaustMap(
                    action =>
                        this.httpClient.requestMapping(action.server)
                            .pipe(
                                map(response => nestedFlowActions.nestedFlowBuildSuccess(response)),
                                catchError((error: any) => of(nestedFlowActions.nestedFlowBuildFailure(error)))
                            )
                )
            )
    );

}