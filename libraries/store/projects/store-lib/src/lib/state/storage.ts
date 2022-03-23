export function getThisState(stateName: any) {
    try{
        const serializedState = localStorage.getItem(stateName);
        if(serializedState === null){ return undefined }
        return JSON.parse(serializedState);
    }catch(err){
        return undefined
    }
  }
  
  export function getItem(itemName: any) {
    const items = getThisState(itemName)
    if (items === undefined) {
        return {todos : []}
    } else {
        return items
    }
  }
  
  export function saveItem(key: any, data: any) {
    const serializedState = JSON.stringify(data);
    localStorage.setItem(key,serializedState);
  }
  
  export function getItemByKey(key: any) {
    try{
        const serializedState = localStorage.getItem(key);
        if(serializedState === null){ return undefined }
        return JSON.parse(serializedState);
    }catch(err){
        return undefined
    }
  }
  
  export function deleteItemByKey(key: any) { localStorage.setItem(key, ''); }
  
  export function emptyLocalStorage(reducerkeys: string[]) {
  
    try{
        if(undefined != reducerkeys && reducerkeys.length > 0){
            for (let key of reducerkeys) {
                localStorage.setItem(key, '');
            }
        }
    }catch(err){
        //console.log("ERROR===emptyLocalStorage==>>>")
    }
  }
  
  export function clearStorage() { localStorage.clear(); }