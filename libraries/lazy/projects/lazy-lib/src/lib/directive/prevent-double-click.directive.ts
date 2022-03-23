import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { debounceTime, Subject, Subscription } from "rxjs";

@Directive({
    selector: '[preventDoubleClick]'
})
export class PreventDoubleClickDirective implements OnInit, OnDestroy {

    @Input() debounceTime = 500;
    @Output() debounceClick = new EventEmitter();

    private clicks = new Subject();
    private subscription!: Subscription;

    ngOnInit(){
        this.subscription = this.clicks.pipe(
            debounceTime(this.debounceTime)
        ).subscribe(e => this.debounceClick.emit(<string> e));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event'])
    clickEvent(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }

    @HostListener('change', ['$event'])
    changeEvent(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }

}