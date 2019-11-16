import {
    Injectable,
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    EmbeddedViewRef,
    TemplateRef,
    Renderer2,
    RendererFactory2,
    Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { DmDialogRef } from './dm-dialog-ref';
import { DmOverlayConfig, IDmOverlayConfig } from './dm-overlay-config';
import { DmTemplateWrapperComponent } from './template-wrapper.component';
import { Point, Rect, getHostElement } from './_utils';
import { Observable } from 'rxjs';

export type ComponentType<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class DmDialogService {
    private _lastId = 1;
    private _dialogs: { [id: string]: DmDialogRef<any> } = {};
    private _globalConfig: DmOverlayConfig = new DmOverlayConfig();
    private _renderer: Renderer2;

    constructor(
        private _appRef: ApplicationRef,
        private _resolver: ComponentFactoryResolver,
        private _injector: Injector,
        private _rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) private document
    ) {
        this._renderer = this._rendererFactory.createRenderer(null, null);
    }

    add<T>(
        dialog: ComponentType<T> | ComponentRef<T> | TemplateRef<T>,
        options?: {
            config?: IDmOverlayConfig,
            templateContext?: any,
            hostElement?: Element | string,
            data?: any,
            afterOpen?: (dialogRef: DmDialogRef<T>) => void
            canClose?: (dialogRef: DmDialogRef<T>) => boolean | Observable<boolean>,
            afterClose?: (dialogRef: DmDialogRef<T>) => void
        }
    ): DmDialogRef<T> {
        if (!options) {
            options = {};
        }

        const dialogRef = new DmDialogRef<T>();
        dialogRef.id = this._lastId++;
        dialogRef.config = new DmOverlayConfig(this._globalConfig).apply(options.config);
        dialogRef.data = options.data;
        dialogRef.afterOpen = options.afterOpen;
        dialogRef.canClose = options.canClose;
        dialogRef.afterClose = options.afterClose;

        const dialogInjector = Injector.create({
            providers: [
                { provide: DmDialogRef, useValue: dialogRef }
            ],
            parent: this._injector
        });

        let componentRef: ComponentRef<any>;
        if (dialog instanceof ComponentRef) {
            componentRef = dialog;
        }
        else if (dialog instanceof TemplateRef) {
            componentRef = this._resolver.resolveComponentFactory(DmTemplateWrapperComponent).create(dialogInjector);
            componentRef.instance.template = dialog;
            componentRef.instance.context = options.templateContext;
        }
        else {
            componentRef = this._resolver.resolveComponentFactory(dialog).create(dialogInjector);
        }
        dialogRef.componentRef = componentRef;
        this._appRef.attachView(componentRef.hostView);

        let element: Element;
        element = typeof options.hostElement === 'string' ? this.document.querySelector(options.hostElement) : options.hostElement;
        if (!element) {
            element = this.document.body;
        }
        this._showDialog(dialogRef, element);

        this._dialogs[dialogRef.id] = dialogRef;
        return dialogRef;
    }

    remove(id: number): void {
        if (this._dialogs[id]) {
            if (this._dialogs[id].canClose) {
                const res = this._dialogs[id].canClose(this._dialogs[id]);
                if (!res) {
                    return;
                }
                if (res instanceof Observable) {
                    const subscription = res.subscribe(result => {
                        if (result) {
                            this._hideDialog(this._dialogs[id]);
                        }
                        subscription.unsubscribe();
                    });
                    return;
                }
            }
            this._hideDialog(this._dialogs[id]);
        }
    }

    private _remove<T>(dialogRef: DmDialogRef<T>) {
        this._appRef.detachView(dialogRef.componentRef.hostView);
        dialogRef.componentRef.destroy();
        this._renderer.removeChild(this._renderer.parentNode(dialogRef.wrapperElement), dialogRef.wrapperElement);
        if (dialogRef.afterClose) {
            dialogRef.afterClose(dialogRef);
        }
        delete this._dialogs[dialogRef.id];
    }

    clear() {
         Object.keys(this._dialogs).forEach(id => {
             this._remove(this._dialogs[id]);
             delete this._dialogs[id];
         });
    }

    getGlobalConfig(): DmOverlayConfig {
        return new DmOverlayConfig(this._globalConfig);
    }

    setGlobalConfig(config: DmOverlayConfig | object): void {
        this._globalConfig = new DmOverlayConfig(config);
    }

    private _showDialog<T>(dialogRef: DmDialogRef<T>, element: Element): void {
        const cfg = dialogRef.config;

        const wrapper: HTMLDivElement = this._renderer.createElement('div');
        this._renderer.setStyle(wrapper, 'position', 'absolute');
        this._renderer.setStyle(wrapper, 'top', 0);
        this._renderer.setStyle(wrapper, 'right', 0);
        this._renderer.setStyle(wrapper, 'bottom', 0);
        this._renderer.setStyle(wrapper, 'left', 0);
        this._renderer.setStyle(wrapper, 'overflow', 'hidden');
        this._renderer.addClass(wrapper, 'ngx-dm-dialog-wrapper');
        if (cfg.hostClass) {
            this._renderer.addClass(wrapper, cfg.hostClass);
        }
        this._renderer.appendChild(element, wrapper);
        dialogRef.wrapperElement = wrapper;
        // const wbb = wrapper.getBoundingClientRect();
        // const wdx = wbb.left;
        // const wdy = wbb.top;

        let animbox: HTMLDivElement;
        if (cfg.animOpen) {
            animbox = this._renderer.createElement('div');
            this._renderer.setStyle(animbox, 'position', 'absolute');
            this._renderer.setStyle(animbox, 'top', 0);
            this._renderer.setStyle(animbox, 'left', 0);
            this._renderer.setStyle(animbox, 'width', 0);
            this._renderer.setStyle(animbox, 'height', 0);
            this._renderer.setStyle(animbox, 'opacity', 0);
            this._renderer.addClass(animbox, 'ngx-dm-dialog-animbox');
            this._renderer.appendChild(wrapper, animbox);
            dialogRef.animboxElement = animbox;
        }

        const at = Math.round(cfg.animOpenDuration / 2);
        let backdrop: HTMLDivElement;
        if (cfg.backdrop) {
            backdrop = this._renderer.createElement('div');
            this._renderer.setStyle(backdrop, 'position', 'absolute');
            this._renderer.setStyle(backdrop, 'top', 0);
            this._renderer.setStyle(backdrop, 'right', 0);
            this._renderer.setStyle(backdrop, 'bottom', 0);
            this._renderer.setStyle(backdrop, 'left', 0);
            this._renderer.setStyle(backdrop, 'opacity', cfg.animOpen ? 0 : cfg.backdropOpacity);
            this._renderer.addClass(backdrop, 'ngx-dm-dialog-backdrop');
            if (cfg.backdropClass) {
                this._renderer.addClass(backdrop, cfg.backdropClass);
            }
            this._renderer.setStyle(backdrop, 'opacity', 0);
            if (cfg.animOpen) {
                this._renderer.setStyle(backdrop, 'transition', `opacity ${at}ms ${cfg.animOpenFn}`);
            }
            this._renderer.appendChild(wrapper, backdrop);
            dialogRef.backdropElement = backdrop;
        }

        const dialog = getHostElement(dialogRef.componentRef);
        if (cfg.dialogClass) {
            this._renderer.addClass(dialog, cfg.dialogClass);
        }

        let start: Rect;
        if (cfg.origin) {
            if (cfg.origin instanceof Rect) {
                start = cfg.origin;
            }
            else if (cfg.origin instanceof Point) {
                start = new Rect(cfg.origin.x, cfg.origin.y, 1, 1);
            }
            else if (cfg.origin instanceof Element) {
                const or = cfg.origin.getBoundingClientRect();
                const oo = this._getOffset(cfg.origin as HTMLElement);
                const oe = this._getOffset(element as HTMLElement);
                start = new Rect(oo.x - oe.x, oo.y - oe.y, or.width, or.height);
            }
        }

        const r = element.getBoundingClientRect();
        const hw = r.width;
        const hh = r.height;
        this._renderer.setStyle(dialog, 'position', 'absolute');
        if (!start) {
            cfg.position = 'center';
            start = new Rect(Math.round(hw / 2) - 1, Math.round(hh / 2) - 1, 2, 2);
        }
        dialogRef.origin = start;

        let end: Rect;
        if (cfg.position == 'fill') {
            this._renderer.setStyle(dialog, 'left', `${cfg.positionPadding}px`);
            this._renderer.setStyle(dialog, 'top', `${cfg.positionPadding}px`);
            this._renderer.setStyle(dialog, 'right', `${cfg.positionPadding}px`);
            this._renderer.setStyle(dialog, 'bottom', `${cfg.positionPadding}px`);
            end = new Rect(cfg.positionPadding, cfg.positionPadding, r.width - cfg.positionPadding * 2, r.height - cfg.positionPadding * 2);
        }
        else if (cfg.position == 'point') {
            this._renderer.setStyle(dialog, 'left', `${start.x}px`);
            this._renderer.setStyle(dialog, 'top', `${start.y}px`);
            end = new Rect(start.x, start.y, 10, 10);
        }
        else {
            end = new Rect();
        }
        this._renderer.setStyle(dialog, 'opacity', 0);
        this._renderer.appendChild(wrapper, dialog);
        setTimeout(() => { // TODO: find out how to correctly detect when view is fully rendered
            const dbb = dialog.getBoundingClientRect();
            end.x = Math.round((hw - dbb.width) / 2);
            end.y = Math.round((hh - dbb.height) / 2);
            if (end.x < 0) {
                end.x = 0;
            }
            if (end.y < 0) {
                end.y = 0;
            }
            if (cfg.position == 'center' || cfg.position == 'point') {
                end.w = dbb.width;
                end.h = dbb.height;
                if (cfg.position == 'point') {
                    end.w = dbb.width;
                    end.h = dbb.height;
                    const p = cfg.positionPadding || 0;
                    if (start.x + p + end.w <= hw) {
                        end.x = start.x + p;
                    }
                    else if (start.x - p - end.w >= 0) {
                        end.x = start.x - p - end.w;
                    }
                    else {
                        end.x = hw - p - end.w;
                    }
                    if (start.y + p + end.h <= hh) {
                        end.y = start.y + p;
                    }
                    else if (start.y - p - end.h >= 0) {
                        end.y = start.y - p - end.h;
                    }
                    else {
                        end.y = hh - p - end.h;
                    }
                    if (end.x < 0) {
                        end.x = 0;
                    }
                    if (end.y < 0) {
                        end.y = 0;
                    }
                }
                this._renderer.setStyle(dialog, 'left', `${end.x}px`);
                this._renderer.setStyle(dialog, 'top', `${end.y}px`);
            }
            if (cfg.animOpen && backdrop) {
                this._renderer.setStyle(backdrop, 'opacity', cfg.backdropOpacity);
            }
            if (cfg.animOpen && animbox && at > 40) {
                animbox.animate(
                    [
                        { top: `${start.y}px`, left: `${start.x}px`, width: `${start.w}px`, height: `${start.h}px`, opacity: .1 },
                        { offset: 1, top: `${end.y}px`, left: `${end.x}px`, width: `${end.w}px`, height: `${end.h}px`, opacity: 1 }
                    ],
                    { duration: cfg.animOpenDuration - 40, delay: 10, endDelay: 30, easing: cfg.animOpenFn }
                );
                setTimeout(() => {
                    this._renderer.setStyle(dialog, 'opacity', 1);
                    if (dialogRef.afterOpen) {
                        dialogRef.afterOpen(dialogRef);
                    }
                }, cfg.animOpenDuration - 50);
            }
            else {
                this._renderer.setStyle(dialog, 'opacity', 1);
                if (dialogRef.afterOpen) {
                    dialogRef.afterOpen(dialogRef);
                }
            }
        });
    }

    private _hideDialog<T>(dialogRef: DmDialogRef<T>): void {
        const cfg = dialogRef.config;
        if (!cfg.animClose || !(cfg.animCloseDuration > 80) || !cfg.origin || !dialogRef.animboxElement) {
            this._remove(dialogRef);
            return;
        }
        const wbb = dialogRef.wrapperElement.getBoundingClientRect();
        const wdx = wbb.left;
        const wdy = wbb.top;
        const dialog = getHostElement(dialogRef.componentRef);
        this._renderer.setStyle(dialog, 'pointer-events', 'none');
        const at = Math.round(cfg.animCloseDuration / 2);
        const dbb = dialog.getBoundingClientRect();
        if (dialogRef.backdropElement) {
            this._renderer.setStyle(dialogRef.backdropElement, 'transition', `opacity ${Math.round(at / 2)}ms`);
            this._renderer.setStyle(dialogRef.backdropElement, 'opacity', 0);
        }
        const r1 = new Rect(dbb.left - wdx, dbb.top - wdy, dbb.width, dbb.height);
        const r2 = new Rect(dialogRef.origin.x, dialogRef.origin.y, 2, 2);
        setTimeout(() => {
            this._renderer.setStyle(dialog, 'opacity', 0);
            dialogRef.animboxElement.animate(
                [
                    { top: `${r1.y}px`, left: `${r1.x}px`, width: `${r1.w}px`, height: `${r1.h}px`, opacity: 1 },
                    { offset: 1, top: `${r2.y}px`, left: `${r2.x}px`, width: `${r2.w}px`, height: `${r2.h}px`, opacity: 0 }
                ],
                { duration: at - 40, delay: 10, endDelay: cfg.animCloseDuration, easing: cfg.animCloseFn }
            );
            setTimeout(() => this._remove(dialogRef), cfg.animCloseDuration);
        });
    }

    private _getOffset(el: HTMLElement): { x: number, y: number } {
        let _x = 0;
        let _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent as HTMLElement;
        }
        return { y: _y, x: _x };
    }

}
