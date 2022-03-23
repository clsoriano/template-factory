import { Inject, Injectable } from "@angular/core";
import { ENV } from "./environment.di";

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    constructor(
        @Inject(ENV) private environment: any
    ) { 
        // Maybe need to connect with API Log to Central Log
        // Please add httpClientService.
    }

    log(message?: any, ...object: any[]) {
        // Show log only is in development mode
        if (!this.environment.production) console.log(`[log][development][${message}]`, object);
    }

    info(className: string, message?: any, ...object: any[]) {
        console.info(`[info][${new Date().toLocaleString()}][${className}][${message}]`, object);
    }

    error(className: string, message?: any, ...object: any[]) {
        console.error(`[error][${new Date().toLocaleString()}][${className}][${message}]`, object);
    }

    warn(className: string, message?: any, ...object: any[]) {
        console.warn(`[warn][${new Date().toLocaleString()}][${className}][${message}]`, object);
    }

}