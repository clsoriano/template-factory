import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Server } from "./entity";

export interface HttpClientService {

    headers: HttpHeaders;
    serverSend: Server;
    parameters: HttpParams;
    
    requestMapping(server: Server): Observable<ArrayBuffer>;
    mapHeaders(httpHeaders: any): void;
    mapParams(server: Server): void;
    getValueParam(value: any): any;
    buildPathParam(server: Server, parameters: any, globalMap?:any, environments?: any): void;
    buildQueryParam(parameters: any, globalMap?:any, environments?: any): void;
    buildMatrixParam(server:any, parameters: any, globalMap?:any, environments?: any): void;
    responseTransform(serviceResponse: ArrayBuffer, handleResponse: any): ArrayBuffer;


}