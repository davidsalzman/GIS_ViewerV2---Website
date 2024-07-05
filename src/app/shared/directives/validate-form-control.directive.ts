import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { Subscription } from 'rxjs';

@Directive({
    selector: '[validateFormControl]',
    standalone: true
})
export class ValidateFormControlDirective implements OnInit, OnDestroy {

    private statusChangeSub?: Subscription;

    constructor(private control: NgControl,
        private el: ElementRef) {
    }

    ngOnInit() {
        if (this.control.statusChanges) {
            this.statusChangeSub = this.control.statusChanges.subscribe(() => {
                this.checkValidation();
            });
        }
    }

    ngOnDestroy() {
        if(this.statusChangeSub)
            this.statusChangeSub.unsubscribe();
    }


    @HostListener('window:keyup', ['$event'])
    public keyEvent(event: KeyboardEvent) {
        this.checkValidation();
    }

    @HostListener('blur', ['$event'])
    public blur(event: KeyboardEvent) {
        this.checkValidation();
    }

    private checkValidation(): void {
        let isValid = true;
        if (this.control.touched && !this.control.valid) {
            isValid = false;
        }

        if (this.el.nativeElement.classList
            && this.el.nativeElement.classList) {
            const classList = this.el.nativeElement.classList as DOMTokenList;
            const containsClass = classList.contains('border-danger');
            if (containsClass && isValid) {
                classList.remove('border-danger');
            } else if (!containsClass && !isValid) {
                classList.add('border-danger');
            }
        }
    }
}