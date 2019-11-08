import {
    Component,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { DmDialogService, DmDialogRef } from '@dimanoid/ngx-dm-dialog';

@Component({
    template: `
    <div style="width: 400px; height: 300px; background: #FFC; border: 1px solid #800; position: absolute; top: 350px; left: 150px; z-index: 7777; box-shadow: 1px 1px 5px 3px #ccc; padding: 10px">
        Dialog 1 - text: {{ text }}
        <br>
        <br>
        <button nz-button (click)="closeDialog.emit()">Close</button>
    </div>`
})
export class Dialog1Component {
    @Input() text: string;
    @Output() closeDialog: EventEmitter<void> = new EventEmitter();

    constructor(private _ds: DmDialogService, private _dr: DmDialogRef<Dialog1Component>) {
        console.log('[Dialog1Component] constructor, _ds:', this._ds);
        console.log('[Dialog1Component] constructor, _dr:', this._dr);
    }

}
