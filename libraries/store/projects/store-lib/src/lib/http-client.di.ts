import { InjectionToken } from "@angular/core";
import { HttpClientService } from "./http-client.interface";

export const HTTP_CLIENT_SERVICE = new InjectionToken<HttpClientService>('HTTP_CLIENT_SERVICE');