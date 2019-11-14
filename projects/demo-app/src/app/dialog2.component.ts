import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { DmDialogService, DmDialogRef } from '@dimanoid/ngx-dm-dialog';

@Component({
    template: `
    <div [class.fit]="fill" class="layout vertical flex" style="background: #FFC; border: 1px solid #800; box-shadow: 1px 1px 5px 3px #ccc; padding: 10px">
        <h2>Custom Dialog</h2>
        <div class="layout mb1"><b class="mr05">text:</b><span>{{ text }}</span></div>
        <div class="flex"></div>
        <button class="start" nz-button (click)="closeDialog.emit()">Close</button>
    </div>`
})
export class Dialog2Component {
    @Input() text: string;
    @Input() fill: boolean;
    @Output() closeDialog: EventEmitter<void> = new EventEmitter();

    constructor(private _ds: DmDialogService, private _dr: DmDialogRef<Dialog2Component>) {
    }

}
