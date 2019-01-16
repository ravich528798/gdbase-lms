import { Directive, ElementRef, HostListener, Input, Inject } from '@angular/core';
import { WindowWrapper } from './WindowWrapper';

@Directive({ selector: '[godwin]' })
export class OpenLinkInNewWindowDirective {
    //@Input('olinwLink') link: string; //intro a new attribute, if independent from routerLink
    @Input('routerLink') link: string;
    constructor(private el: ElementRef, @Inject(WindowWrapper) private win:Window) {
    }
    @HostListener('mousedown') onMouseEnter() {
        this.win.open(this.link || 'main/default');
    }
}