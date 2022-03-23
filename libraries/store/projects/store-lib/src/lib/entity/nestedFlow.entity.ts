import { Div } from "./div.entity";

export class NestedFlow {
    
    id?: string;
    name?: string;
    body?: Div;

    constructor(
        id: string,
        name: string,
        body: Div
    ){
        this.id = id;
        this.name = name;
        this.body = body;
    }

}