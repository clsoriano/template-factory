import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JSONPath } from 'jsonpath-plus';
import { anonymousFunction, getValueFromStorage, HttpClientService, LoggerService, matchValues, Server, validateExpression } from 'store-lib';

@Injectable({
  providedIn: 'root'
})
export class HttpClientServiceImpl implements HttpClientService {

  headers!: HttpHeaders;
  serverSend!: Server;
  parameters!: HttpParams;

  constructor(
    private httpClient: HttpClient,
    private logger: LoggerService
  ) {
  }


  requestMapping(server: Server) {
    this.serverSend = {...server}; // create copy of object server
    this.headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*'});

    // Extracting objects
    let { body, httpHeaders, method, response: handleResponse } = this.serverSend;

    // Clone object for reset values.
    //utils.cloneObject(server, this.serverSend);

    //Build map params to send in request
    this.parameters = new HttpParams();
    this.mapParams(this.serverSend);

    // Adding more headers
    this.mapHeaders(httpHeaders);
    
    let responseType: any = "json"; // validate if neccesary change this configurations

    const options = {
      headers : this.headers,
      body,
      params: this.parameters,
      responseType,
      //reportProgress: true // Show process of request, search more about this uses
    };
    
    return this.httpClient.request(method, `${this.serverSend.uri}`, options).pipe(
      map(response => this.responseTransform(response, handleResponse))/*,
      catchError(err => {
        console.log(err);
        return of([]);
      })*/
    );
  }


  mapHeaders(httpHeaders: any): void {
    if ( httpHeaders ) {
      
      for (let key in httpHeaders) {
        this.headers = this.headers.append(key, httpHeaders[key]/* this.getValueParam(httpHeaders[key]) */);
      }

    }
  }

  mapParams(server: Server): void {
    const { httpParameter } = server;
    
    if (!httpParameter) return; // Return if the parameters is undefined.

    const { type, parameterList } = httpParameter;
    
    if(!type || !parameterList) {
      this.logger.warn(HttpClientServiceImpl.name, 'Server: Type or Parameters are not defined.');
      return; // Return if one of the value is undefined.
    }
    
    // Looking for more type supports in request documentation...?
    
    if (type === 'PATH') {
      this.buildPathParam(server, parameterList);

    } else if(type === 'QUERY') {
      this.buildQueryParam(parameterList);

    } else if (type === 'MATRIX') {
      this.buildMatrixParam(server, parameterList);

    }

  }

  getValueParam(value: any): any {
    let valueTemp = undefined;
    let expression = validateExpression(value);

    //Verifico si hay una expresión y no un valor directo, si lo hay se evalua la expresión
    if (expression) {
      valueTemp = anonymousFunction(expression);
    } else {
      const values = matchValues(value) || [];

      if (values && values.length > 0) {

        for (let value of values) {
          let newVal = getValueFromStorage(value);
          valueTemp = value.replace(value, newVal);
        }

      }

    }

    return valueTemp || value;
  }

  buildPathParam(server: Server, parameters: any, globalMap?:any, environments?: any) {
    let paramPath = '';

    for (let key in parameters) {
      paramPath += `/${this.getValueParam(parameters[key])}`;
    }

    // return new URL with parameters in path
    server.uri = `${server.uri}${paramPath}`;
  }

  buildQueryParam(parameters: any, globalMap?:any, environments?: any) {

    for (let key in parameters) {
      this.parameters = this.parameters.append(key, this.getValueParam(parameters[key]));
    }

  }

  buildMatrixParam(server:any, parameters: any, globalMap?:any, environments?: any) {
    let paramMatrix = '';
    
    for (let key in parameters) {
      paramMatrix += `;${key}=${this.getValueParam(parameters[key])}`;
    }

    server.url = `${server.url}${paramMatrix}`;
  }

  responseTransform(serviceResponse: ArrayBuffer, handleResponse: any): ArrayBuffer {
    
    if(!handleResponse) return serviceResponse;
    
    let response: any = {};
    for (let i in handleResponse) {
      response[i] = JSONPath(handleResponse[i], serviceResponse, ()=>{}, ()=>{});
    }

    return response;

  }


}
