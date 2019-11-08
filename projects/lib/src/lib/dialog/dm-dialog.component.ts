import {
    Component, OnInit, AfterViewInit,
    ChangeDetectionStrategy, ViewEncapsulation,
    Input, ElementRef, ChangeDetectorRef, NgZone,
    Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit
} from '@angular/core';
import { InputNumber, InputBoolean } from '../_utils';

import { DmDialogService } from '../dm-dialog.service';

export const MIN_ITEM_SIZE = 30;

export interface DmTableSort {
    colId: string;
    order: number;
}

export interface DmTableRowEvent {
    index: number;
    row: any;
    event: MouseEvent;
}

export interface DmTableHeaderEvent {
    colId: string;
    index: number;
    first: boolean;
    last: boolean;
    event: MouseEvent;
}

@Component({
    selector: 'dm-dialog',
    exportAs: 'dmDialog',
    templateUrl: './dm-dialog.component.html',
    styleUrls: ['./dm-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class DmDialogComponent implements OnInit, AfterViewInit, OnChanges, AfterContentInit {
    @Input() @InputBoolean() booleanProperty: boolean = false;

    @Input() @InputNumber() numberProperty: number;
    @Output() numberPropertyChange: EventEmitter<number> = new EventEmitter();

    constructor(private _elemRef: ElementRef, private _cdr: ChangeDetectorRef, private _ngZone: NgZone, private _srv: DmDialogService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

}
