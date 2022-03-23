import { Inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of } from "rxjs";
import * as viewActions from "../actions";
import { HTTP_CLIENT_SERVICE } from "../http-client.di";
import { HttpClientService } from "../http-client.interface";

@Injectable()
export class ViewEffects {

    constructor(
        private actions$: Actions,
        @Inject(HTTP_CLIENT_SERVICE) private httpClient: HttpClientService
    ) {}

    viewBuild = createEffect(
        () =>
            this.actions$.pipe(
                ofType(viewActions.viewBuild),
                exhaustMap(
                    action => 
                        this.httpClient.requestMapping(action.server)
                            .pipe(
                                map(response => viewActions.viewBuildSuccess(response)),
                                catchError((error: any) => of(viewActions.viewBuildFailure(error)) )
                            )
                )
            )
    );

}