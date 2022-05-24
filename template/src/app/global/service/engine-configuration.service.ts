import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as viewActions from 'store-lib';

@Injectable({
  providedIn: 'root'
})
export class EngineConfigurationService {

  constructor(
    private readonly store: Store
  ) {
  }

  async init(): Promise<any> {
    viewActions.clearStorage();

    return new Promise((resolve, reject) => {
      const key = window.location.pathname;
      let search;
      // assing values in redux
      let server = {};
      
      /** Get configuration of site from profile.json
       * 
       * I need to validate if the information it is in localstorage
       */

      try {

        // find by token or find by view;
        if (key.indexOf('embedded') != -1) {
          search = key.split('/')[2];
          server = {
            uri: environment.uriByToken,
            method: 'GET',
            httpHeaders: {
              'x-auth-token': search
            }
          }

        } else if (key.indexOf('ui') != -1) {
          search = key.split('/')[2];
          server = {
            uri: environment.uriByName,
            method: 'GET',
            httpHeaders : {
              'x-name-view': search
            }
          }

        }

        //Resolve with redux action....
        //localstorage
        // server -> default
        this.store.dispatch(viewActions.viewBuild( { server } ));
        
        return resolve('success');

      } catch(err) {
        return reject(err);
      }

    });
  }

}
