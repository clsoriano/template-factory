import { InputElement } from "./inputElement.entity";

export class Div {

    id: string;
    name: string;
    class: string[];
    style: any; // Type {key: value} -> { 'font-family': 'Arial' } 
    div: Div;
    divList: Div[];
    input: InputElement;
    table: InputElement;
    textPlain: string;
    textHtml: string;
    isForm: boolean;
    isStep: boolean;

    constructor(
        options: {
            id: string, 
            name: string,
            class: string[],
            style: any,
            div: Div,
            divList: Div[],
            input: InputElement,
            table: InputElement,
            textPlain: string,
            textHtml: string,
            isForm: boolean,
            isStep: boolean
        }
    ) {
        this.id = options.id;
        this.name = options.name;
        this.class = options.class;
        this.style = options.style;
        this.div = options.div;
        this.divList = options.divList;
        this.input = options.input;
        this.table = options.table;
        this.textPlain = options.textPlain;
        this.textHtml = options.textHtml;
        this.isForm = options.isForm;
        this.isStep = options.isStep;
    }

}