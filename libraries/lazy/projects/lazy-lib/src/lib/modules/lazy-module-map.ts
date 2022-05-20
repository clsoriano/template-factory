import { InjectionToken } from '@angular/core';
import { LazyModules } from '../models/lazyModules';

export const LAZY_MODULE_MAP_REGISTER: LazyModules = {
    "body": { loadChildren: () => import('./div-module/div.module').then(m => m.DivModule) },
    "text|password|number": { loadChildren: () => import('./input-module/input.module').then(m => m.InputModule) },
    "button": { loadChildren: () => import('./button-module/button.module').then(m => m.ButtonModule) },
    "select": { loadChildren: () => import('./select-module/select.module').then(m => m.SelectModule) },
    "calendar": { loadChildren: () => import('./calendar-module/calendar.module').then(m => m.CalendarModule) },
    "radio": { loadChildren: () => import('./radio-group-module/radio-group.module').then(m => m.RadioGroupModule) },
    "checkbox": { loadChildren: () => import('./checkbox-module/checkbox.module').then(m => m.CheckboxModule) },
    "image": { loadChildren: () => import('./image-module/image.module').then(m => m.ImageModule) },
    "texarea": { loadChildren: () => import('./textarea-module/textarea.module').then(m => m.TextareaModule) },
    "progress": { loadChildren: () => import('./progress-module/progress.module').then(m => m.ProgressModule) },
    "readMoreFade": { loadChildren: () => import('./read-more-fade-module/read-more-fade.module').then(m => m.ReadMoreFadeModule) }
}

export const LAZY_MODULES_MAP = new InjectionToken<LazyModules>('LAZY_MODULES_MAP');
 
