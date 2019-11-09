import { Component, Input, TemplateRef } from '@angular/core';

@Component({
    template: `<ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="context"></ng-container>`
})
export class DmTemplateWrapperComponent {
    @Input() template: TemplateRef<any>;
    @Input() context: any;

    constructor() { }

}
