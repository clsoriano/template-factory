import { JSONPath } from 'jsonpath-plus';
import * as storage from './state/storage';

const regex: RegExp = new RegExp(/\$[A-Za-z0-9-.]+/g);
const JSONPathRegex = new RegExp(/^\$[A-Za-z0-9 \.\*\[\]\(\)\-\@\,\?\&\!\=\>\'\"\/\$\^\~]+/g);
const regexExpression = new RegExp(/(?![\(\)=>{]|[\(expression\)=>{]|[\(expression\) => {])(.*?)}$/g);

export function matchValues(value: string): any {
  // Extract names of controls if exists in value like this $.form01.keyName
  return value.match(JSONPathRegex);
}

export function getValueFromStorage(search: any): any {
  if (typeof search !== 'string') return search;

  let found = search.match(regex);

  if (found) {

    const dataCustomer = storage.getItem('dataCustomer'); // extract data customer from storage
    const dataEnviroment = storage.getItem('dataEnviroment'); // extract data customer from storage

    let value = getValueWithJSONPath(found[0], dataCustomer)
      || getValueWithJSONPath(found[0], dataEnviroment) || search;

    value = (value instanceof Array && value.length === 1) ? value[0] : value;

    return value;

  }

  return search;

}

export function anonymousFunction(expression: any, globalMap?: any, environments?: any) {
  if (expression) {
    let params = 'globalMap, environments, jp';
    const myFunc = new Function(params, expression);
    const env = { env: environments };
    return myFunc(globalMap, env, JSONPath);
  }

  return undefined;
}


export const saveGlobalData = (key: string, data: any, parentKey: string = 'dataCustomer') => {
  let dataTemp = storage.getItemByKey(parentKey) || {}; // { global: name: {d: 1} }
  dataTemp[key] = data;
  storage.saveItem(parentKey, dataTemp);
}

export function validateExpression(value: any): any {
  // Validate if value is string for get the match
  if (typeof value !== 'string') return undefined;

  let expression = value.match(regexExpression) || undefined;

  return expression ? expression[0] : undefined;
}

export function cloneObject(object: any, newObject: any) {
  // review performance in for in....
  for (const i in object) {
    if (object[i] !== null && typeof (object[i]) === 'object') {
      newObject[i] = (object[i] instanceof Array) ? [] : {};
      cloneObject(object[i], newObject[i]);
    } else {
      newObject[i] = object[i];
    }
  }
}


export function customFunction(value: any, control: any, expression: any, values?: any) {

  //Create altern variables for update and then need to update the state in redux
  let controlTemp = { ...control };

  // using strict mode for more secure Javascript.
  const tempFunc = new Function('value, control, values', `'use strict'; return (${expression})`);

  // run action for update the state value

  return { functionResult: tempFunc(value, controlTemp, values) };

}

export function getValueWithJSONPath(search: string, object: any) {
  // if exists match of regex extractValue otherwise return the same value
  if (matchValues(search)) return JSONPath(search, object, () => { }, () => { });

  return search;

}