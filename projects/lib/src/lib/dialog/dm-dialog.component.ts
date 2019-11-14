import {
    Component, OnInit, AfterViewInit, ViewEncapsulation,
    Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit,
    ContentChild, TemplateRef, HostBinding, HostListener, Renderer2
} from '@angular/core';
import { InputBoolean, Point, getHostElement } from '../_utils';

import { DmDialogService } from '../dm-dialog.service';
import { DmDialogRef } from '../dm-dialog-ref';
import { IDmDialogConfig } from '../dm-dialog-config';

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

    @Input() @InputBoolean() maximized: boolean = false;
    @Output() maximizedChange: EventEmitter<boolean> = new EventEmitter();

    @HostBinding('class.ngx-dmd-container') hostContainer: boolean = true;
    @HostBinding('class.ngx-dmd-dragging') dragging: boolean = false;
    @HostBinding('class.ngx-dmd-draggable') draggable: boolean = false;

    config: IDmDialogConfig;
    dragStartPoint: Point;

    constructor(private _renderer: Renderer2, private _ds: DmDialogService, private _dr: DmDialogRef<DmDialogComponent>) {
        this.config = this._dr.config;
        this.draggable = this.config.dialogDraggable;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }

    ngAfterContentInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    closeDialog() {
        this._ds.remove(this._dr.id);
    }

    dragStart(e: MouseEvent) {
        if (!this._dr.config.dialogDraggable || this._dr.config.position != 'fill') {
            return;
        }
        this.dragStartPoint = new Point(e.clientX, e.clientY);
        this.dragging = true;
        console.log('dragStart', this.dragStartPoint);
    }

    dragEnd(e: MouseEvent) {
        if (!this.dragging) {
            return;
        }
        this.dragging = false;
        this.dragStartPoint = undefined;
        console.log('dragEnd');
    }

    @HostListener('document:mousemove', ['$event'])
    dragMove(e: MouseEvent) {
        if (!this.dragging) {
            return;
        }
        const dialog = getHostElement(this._dr.componentRef);;
        const x = +dialog.style.left + e.clientX - this.dragStartPoint.x;
        const y = +dialog.style.top + e.clientY - this.dragStartPoint.y;
        this._renderer.setStyle(dialog, 'left', x);
        this._renderer.setStyle(dialog, 'top', y);
        console.log('dragMove', `${x}x${y}`);
    }

}
