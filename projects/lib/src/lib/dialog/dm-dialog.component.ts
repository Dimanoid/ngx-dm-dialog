import {
    Component, OnInit, AfterViewInit, ViewEncapsulation,
    Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterContentInit,
    ContentChild, TemplateRef, HostBinding, HostListener, Renderer2, Inject
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

    @Input() @InputBoolean()
    set maximized(v: boolean) {
        this.maximizedClass = v;
    }
    @Output() maximizedChange: EventEmitter<boolean> = new EventEmitter();

    @HostBinding('class.ngx-dmd-maximized') maximizedClass: boolean;
    @HostBinding('class.ngx-dmd-container') hostContainer: boolean = true;
    @HostBinding('class.ngx-dmd-dragging') dragging: boolean = false;
    @HostBinding('class.ngx-dmd-draggable') draggable: boolean = false;

    config: IDmDialogConfig;
    dragStartPoint: Point;
    dialogDragStartPoint: Point;

    constructor(
        private _renderer: Renderer2,
        private _ds: DmDialogService,
        private _dr: DmDialogRef<DmDialogComponent>
    ) {
        this.config = this._dr.config;
        this.draggable = this.config.dialogDraggable && this.config.position != 'fill';
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
        if (!this._dr.config.dialogDraggable || this._dr.config.position == 'fill' || e.buttons != 1 || this.maximizedClass) {
            return;
        }
        this.dragStartPoint = new Point(e.clientX, e.clientY);
        const dialog = getHostElement(this._dr.componentRef);
        this.dialogDragStartPoint = new Point(parseInt(dialog.style.left, 10), parseInt(dialog.style.top, 10));
        this.dragging = true;
    }

    @HostListener('document:mouseup', ['$event'])
    dragEnd(e: MouseEvent) {
        if (!this.dragging) {
            return;
        }
        this.dragging = false;
        this.dragStartPoint = undefined;
    }

    @HostListener('document:mousemove', ['$event'])
    dragMove(e: MouseEvent) {
        if (!this.dragging) {
            return;
        }
        const dialog = getHostElement(this._dr.componentRef);
        const dbb = dialog.getBoundingClientRect();
        const wbb = this._dr.wrapperElement.getBoundingClientRect();
        const x = this._checkCoordinate(this.dialogDragStartPoint.x + e.clientX - this.dragStartPoint.x, dbb.width, wbb.width);
        const y = this._checkCoordinate(this.dialogDragStartPoint.y + e.clientY - this.dragStartPoint.y, dbb.height, wbb.height, true);
        this._renderer.setStyle(dialog, 'left', `${x}px`);
        this._renderer.setStyle(dialog, 'top', `${y}px`);
    }

    private _checkCoordinate(xy: number, d: number, w: number, y = false): number {
        if (xy < 0) {
            if (this.config.dialogKeepInBoundaries || y) {
                return 0;
            }
            else if (xy + d - 40 < 0) {
                return -d + 40;
            }
        }
        else if (xy + d > w) {
            if (this.config.dialogKeepInBoundaries) {
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
        this.draggable = this.maximizedClass ? false : this.config.dialogDraggable && this.config.position != 'fill';
    }

    getMaxWidth() {
        return this.maximizedClass
            ? document.body.clientWidth
            : this._dr.wrapperElement.getBoundingClientRect().width - this.config.positionPadding * 2;
    }

}
