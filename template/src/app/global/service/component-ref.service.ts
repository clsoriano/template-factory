import { Injectable } from '@angular/core';
import { ComponentRefInterface } from 'lazy-lib';

@Injectable({
  providedIn: 'root'
})
export class ComponentRefService {

  componentReferenceList: ComponentRefInterface;

  constructor() { 
    this.componentReferenceList = {};
  }
  
}
