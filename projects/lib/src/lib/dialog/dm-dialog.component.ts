import {
    Component, OnInit, AfterViewInit, ViewEncapsulation,
    Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit,
    ContentChild, TemplateRef, HostBinding, HostListener, Renderer2
} from '@angular/core';
import { InputBoolean, Point, getHostElement, Rect } from '../_utils';

import { DmDialogService } from '../dm-dialog.service';
import { DmDialogRef } from '../dm-dialog-ref';
import { IDmDialogConfig, DmDialogConfig } from '../dm-dialog-config';
import { IDmOverlayConfig } from '../dm-overlay-config';

@Component({
    selector: 'dm-dialog',
    exportAs: 'dmDialog',
    templateUrl: './dm-dialog.component.html',
    styleUrls: ['./dm-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DmDialogComponent implements OnInit, AfterViewInit, OnChanges, AfterContentInit {
    @Input() titleText: string;
    private _config: IDmDialogConfig = new DmDialogConfig();
    @Input()
    set config(v: IDmDialogConfig) {
        this._config = new DmDialogConfig(v);
        this.draggable = this.config.draggable && this.dialogRef.config.position != 'fill';
    }
    get config(): IDmDialogConfig {
        return this._config;
    }

    @ContentChild('header', { static: false }) headerTpl: TemplateRef<any>;
    @ContentChild('content', { static: false }) contentTpl: TemplateRef<any>;
    @ContentChild('footer', { static: false }) footerTpl: TemplateRef<any>;

    @Input() @InputBoolean()
    set maximized(v: boolean) {
        this.maximizedClass = v;
    }
    @Output() maximizedChange: EventEmitter<boolean> = new EventEmitter();

    @HostBinding('class.ngx-dmd-maximized') maximizedClass: boolean;
    @HostBinding('class.ngx-dmd-container') hostContainer: boolean = true;
    @HostBinding('class.ngx-dmd-dragging') dragging: boolean = false;
    @HostBinding('class.ngx-dmd-draggable') draggable: boolean = false;

    dragStartPoint: Point;
    dialogDragStartPoint: Rect;
    overlayConfig: IDmOverlayConfig;
    resize?: Rect;

    constructor(
        private _renderer: Renderer2,
        private _ds: DmDialogService,
        public dialogRef: DmDialogRef<DmDialogComponent>
    ) {
        this.draggable = this.config.draggable && this.dialogRef.config.position != 'fill';
        this.overlayConfig = this.dialogRef.config;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        const dialog = getHostElement(this.dialogRef.componentRef);
        if (!this.maximizedClass && (!this.overlayConfig || this.overlayConfig.position != 'fill')) {
            if (this.config.maxWidth) {
                this._renderer.setStyle(dialog, 'max-width', `${this.config.maxWidth}px`);
            }
            if (this.config.maxHeight) {
                this._renderer.setStyle(dialog, 'max-height', `${this.config.maxHeight}px`);
            }
            this._renderer.setStyle(dialog, 'min-width', `${this.config.minWidth}px`);
            this._renderer.setStyle(dialog, 'min-height', `${this.config.minHeight}px`);
        }
    }

    ngAfterContentInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    closeDialog() {
        this._ds.remove(this.dialogRef.id);
    }

    dragStart(e: MouseEvent, resize?: Rect) {
        if (this.dialogRef.config.position == 'fill' || e.buttons != 1 || this.maximizedClass) {
            return;
        }
        if ((resize && this.config.resizable) || this.config.draggable) {
            this.dragStartPoint = new Point(e.clientX, e.clientY);
            const dialog = getHostElement(this.dialogRef.componentRef);
            const dbb = dialog.getBoundingClientRect();
            this.dialogDragStartPoint = new Rect(
                parseInt(dialog.style.left, 10),
                parseInt(dialog.style.top, 10),
                dbb.width,
                dbb.height,
            );
            if (resize) {
                this.resize = resize;
                this.dragging = false;
            }
            else {
                this.dragging = true;
                this.resize = undefined;
            }
        }
    }

    @HostListener('document:mouseup', ['$event'])
    dragEnd(e: MouseEvent) {
        if (this.resize) {
            this.resize = undefined;
        }
        if (!this.dragging) {
            return;
        }
        this.dragging = false;
        this.dragStartPoint = undefined;
    }

    @HostListener('document:mousemove', ['$event'])
    dragMove(e: MouseEvent) {
        if (!this.dragging && !this.resize) {
            return;
        }
        const dialog = getHostElement(this.dialogRef.componentRef);
        const dbb = dialog.getBoundingClientRect();
        const wbb = this.dialogRef.wrapperElement.getBoundingClientRect();
        if (this.resize) {
            const r = this.resize;
            const mx = e.clientX - this.dragStartPoint.x;
            const my = e.clientY - this.dragStartPoint.y;
            const _x = this.dialogDragStartPoint.x + mx * r.x;
            const _y = this.dialogDragStartPoint.y + my * r.y;
            const x = this._checkCoordinate(_x, dbb.width, wbb.width);
            const y = this._checkCoordinate(_y, dbb.height, wbb.height, true);
            const dx = _x - x;
            const dy = _y - y;
            const w = mx * r.w + this.dialogDragStartPoint.w;
            const h = my * r.h + this.dialogDragStartPoint.h;
            console.log(`[dragMove] [x*y]=[${x}*${y}], [w*h]=[${w}*${h}], [dx*dy]=[${dx}*${dy}]`);
            this._renderer.setStyle(dialog, 'left', `${x}px`);
            this._renderer.setStyle(dialog, 'top', `${y}px`);
            this._renderer.setStyle(dialog, 'width', `${w}px`);
            this._renderer.setStyle(dialog, 'height', `${h}px`);
        }
        else {
            const x = this._checkCoordinate(this.dialogDragStartPoint.x + e.clientX - this.dragStartPoint.x, dbb.width, wbb.width);
            const y = this._checkCoordinate(this.dialogDragStartPoint.y + e.clientY - this.dragStartPoint.y, dbb.height, wbb.height, true);
            this._renderer.setStyle(dialog, 'left', `${x}px`);
            this._renderer.setStyle(dialog, 'top', `${y}px`);
        }
    }

    private _checkCoordinate(xy: number, d: number, w: number, y = false): number {
        if (xy < 0) {
            if (this.config.keepInBoundaries || y) {
                return 0;
            }
            else if (xy + d - 40 < 0) {
                return -d + 40;
            }
        }
        else if (xy + d > w) {
            if (this.config.keepInBoundaries) {
                return w - d;
            }
            else if (xy + 40 > w) {
                return w - 40;
            }
        }
        return xy;
    }

    toggleMaximized() {
        this.maximized = !this.maximizedClass;
        this.maximizedChange.emit(this.maximizedClass);
        this.draggable = this.maximizedClass ? false : this.config.draggable && this.dialogRef.config.position != 'fill';
    }

    getMaxWidth() {
        return this.maximizedClass
            ? document.body.clientWidth
            : this.dialogRef.wrapperElement.getBoundingClientRect().width - this.dialogRef.config.positionPadding * 2;
    }

}
