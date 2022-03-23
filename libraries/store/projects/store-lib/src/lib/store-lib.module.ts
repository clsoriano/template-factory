import { HttpClientModule } from "@angular/common/http";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { reducers, metaReducers } from ".";
import { ViewEffects, NestedFlowEffects } from "./effects";
import { CommonModule } from "@angular/common";
import { ENV } from "./environment.di";
import { LoggerService } from "./logger.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forRoot(
      reducers, {
      metaReducers
    }
    ),
    EffectsModule.forRoot([ViewEffects, NestedFlowEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: false }),
  ],
  providers: []
})
export class StoreLibModule {

  public static forRoot(environments: any): ModuleWithProviders<StoreLibModule> {
    
    return {
      ngModule: StoreLibModule,
      providers: [
        {
          provide: ENV,
          useValue: environments
        }
      ]
    };

  }

}
