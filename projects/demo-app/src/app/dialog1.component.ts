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
                    <div class="layout mb05"><b class="mr05">Attached to:</b><span>{{ text }}</span></div>
                    <div class="layout center mb1">
                        <b class="mr05">Rows({{ rows.length }}):</b>
                        <button class="mr05" nz-button nzShape="circle" [disabled]="rows.length < 2" (click)="rows.pop()">-</button>
                        <button nz-button nzShape="circle" (click)="rows.push(1)">+</button>
                        <b class="ml2 mr05">Cols({{ cols.length }}):</b>
                        <button class="mr05" nz-button nzShape="circle" [disabled]="cols.length < 2" (click)="cols.pop()">-</button>
                        <button nz-button nzShape="circle" (click)="cols.push(1)">+</button>
                    </div>
                    <div>
                        <div *ngFor="let r of rows; let y = index; let ly = last" class="layout">
                            <div *ngFor="let c of cols; let x = index; let lx = last" class="ngx-dm-demo-cell layout center-center fs0">
                                {{ x }} / {{ y }}
                            </div>
                        </div>
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

    rows: number[] = [1, 1, 1, 1];
    cols: number[] = [1, 1, 1, 1, 1, 1, 1];

    constructor(private _ds: DmDialogService, private _dr: DmDialogRef<Dialog1Component>) {
    }

}
