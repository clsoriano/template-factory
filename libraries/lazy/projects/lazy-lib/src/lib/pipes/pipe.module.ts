import { NgModule } from "@angular/core";
import { DateFormatPipe } from "./date-format.pipe";
import { LeftPadPipe } from "./left-pad.pipe";
import { SafeResourcePipe } from "./safe-source.pipe";

@NgModule({
    declarations: [
        SafeResourcePipe,
        DateFormatPipe,
        LeftPadPipe
    ],
    exports: [
        SafeResourcePipe,
        DateFormatPipe,
        LeftPadPipe
    ]
  })
  export class PipeModule { }