import {
    Component, OnInit, AfterViewInit,
    ChangeDetectionStrategy, ViewEncapsulation,
    Input, ChangeDetectorRef,
    Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit, ContentChild, TemplateRef
} from '@angular/core';
import { InputNumber, InputBoolean } from '../_utils';

import { DmDialogService } from '../dm-dialog.service';
import { DmDialogRef } from '../dm-dialog-ref';

@Component({
    selector: 'dm-dialog',
    exportAs: 'dmDialog',
    templateUrl: './dm-dialog.component.html',
    styleUrls: ['./dm-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DmDialogComponent implements OnInit, AfterViewInit, OnChanges, AfterContentInit {
    @Input() titleText: string;
    @ContentChild('header', { static: false }) headerTpl: TemplateRef<any>;
    @ContentChild('content', { static: false }) contentTpl: TemplateRef<any>;
    @ContentChild('footer', { static: false }) footerTpl: TemplateRef<any>;

    constructor(private _cdr: ChangeDetectorRef, private _ds: DmDialogService, private _dr: DmDialogRef<DmDialogComponent>) {
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
