import { Type } from "@angular/core";

export interface LazyModules {
    [key: string]: {loadChildren: () => Promise<Type<any>>};
}
