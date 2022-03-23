import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EngineConfigurationService } from './global/service/engine-configuration.service';
import { EngineBuilderComponent } from './main/engine-builder/engine-builder.component';
import { HttpInterceptorService } from './global/interceptor/http.interceptor.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DateFormatPipe, LazyLibModule, LAZY_MODULE_MAP_REGISTER, LAZY_MODULES_MAP, LazyLibService } from 'lazy-lib';
import { HTTP_CLIENT_SERVICE, LoggerService, StoreLibModule } from 'store-lib';
import { environment } from 'src/environments/environment';
import { HttpClientServiceImpl } from './global/service/http-client.service.impl';

@NgModule({
  declarations: [
    AppComponent,
    EngineBuilderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    StoreLibModule.forRoot(environment),
    LazyLibModule
  ],
  providers: [
    EngineConfigurationService,
    DateFormatPipe,
    HttpInterceptorService,
    LazyLibService,
    LoggerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (service: EngineConfigurationService) => function() { return service.init(); },
      deps: [EngineConfigurationService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpInterceptorService, multi: true
    },
    { 
      provide: LAZY_MODULES_MAP,
      useValue: LAZY_MODULE_MAP_REGISTER
    },
    {
      provide: HTTP_CLIENT_SERVICE,
      useClass: HttpClientServiceImpl
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
