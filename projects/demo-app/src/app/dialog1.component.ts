import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { DmDialogService, DmDialogRef } from '@dimanoid/ngx-dm-dialog';

@Component({
    template: `
        <dm-dialog>
            <ng-template #header>
                <div>DmDialog header</div>
                <small>Subheader text</small>
            </ng-template>
            <ng-template #content>
                <div class="layout vertical flex">
                    <div class="layout mb1"><b class="mr05">text:</b><span>{{ text }}</span></div>
                    <div class="flex"></div>
                </div>
            </ng-template>
            <ng-template #footer>
                <div class="layout flex">
                    <div class="flex"></div>
                    <button class="mr05" nz-button nzType="primary">Action</button>
                    <button class="mr05" nz-button nzType="danger">Danger Action</button>
                    <button nz-button (click)="closeDialog.emit()">Close</button>
                </div>
            </ng-template>
        </dm-dialog>
    `
})
export class Dialog1Component {
    @Input() text: string;
    @Input() fill: boolean;
    @Output() closeDialog: EventEmitter<void> = new EventEmitter();

    constructor(private _ds: DmDialogService, private _dr: DmDialogRef<Dialog1Component>) {
    }

}
