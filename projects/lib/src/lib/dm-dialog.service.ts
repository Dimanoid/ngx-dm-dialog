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
import { DmDialogConfig, IDmDialogConfig } from './dm-dialog-config';
import { DmTemplateWrapperComponent } from './template-wrapper.component';
import { Point, Rect } from './_utils';

export type ComponentType<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class DmDialogService {
    private _lastId = 1;
    private _dialogs: { [id: string]: DmDialogRef<any> } = {};
    private _globalConfig: DmDialogConfig = new DmDialogConfig();
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
            config?: IDmDialogConfig,
            templateContext?: any,
            hostElement?: Element | string
        }
    ): DmDialogRef<T> {
        if (!options) {
            options = {};
        }
        const dialogRef = new DmDialogRef<T>();
        dialogRef.id = this._lastId++;
        dialogRef.config = new DmDialogConfig(this._globalConfig).apply(options.config);
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

    remove(id: number): boolean {
        if (this._dialogs[id]) {
            this._hideDialog(this._dialogs[id]);
            delete this._dialogs[id];
            return true;
        }
        return false;
    }

    private _remove<T>(dialogRef: DmDialogRef<T>) {
        this._appRef.detachView(dialogRef.componentRef.hostView);
        dialogRef.componentRef.destroy();
        this._renderer.removeChild(this._renderer.parentNode(dialogRef.wrapperElement), dialogRef.wrapperElement);
    }

    clear() {
         Object.keys(this._dialogs).forEach(id => {
             this._remove(this._dialogs[id]);
             delete this._dialogs[id];
         });
    }

    getGlobalConfig(): DmDialogConfig {
        return new DmDialogConfig(this._globalConfig);
    }

    setGlobalConfig(config: DmDialogConfig | object): void {
        this._globalConfig = new DmDialogConfig(config);
    }

    private _getHostElement(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

    private _showDialog<T>(dialogRef: DmDialogRef<T>, element: Element): void {
        const cfg = dialogRef.config;

        const wrapper: HTMLDivElement = this._renderer.createElement('div');
        this._renderer.setStyle(wrapper, 'position', 'absolute');
        this._renderer.setStyle(wrapper, 'top', 0);
        this._renderer.setStyle(wrapper, 'right', 0);
        this._renderer.setStyle(wrapper, 'bottom', 0);
        this._renderer.setStyle(wrapper, 'left', 0);
        this._renderer.addClass(wrapper, 'ngx-dm-dialog-wrapper');
        if (cfg.hostClass) {
            this._renderer.addClass(wrapper, cfg.hostClass);
        }
        this._renderer.appendChild(element, wrapper);
        dialogRef.wrapperElement = wrapper;

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

        const dialog = this._getHostElement(dialogRef.componentRef);
        if (cfg.dialogClass) {
            this._renderer.addClass(dialog, cfg.dialogClass);
        }

        let start: Rect;
        if (cfg.origin) {
            if (cfg.origin instanceof Rect) {
                start = new Rect(cfg.origin.x, cfg.origin.y, cfg.origin.w, cfg.origin.h);
            }
            else if (cfg.origin instanceof Point) {
                start = new Rect(cfg.origin.x, cfg.origin.y, 1, 1);
            }
            else if (cfg.origin instanceof Element) {
                const or = cfg.origin.getBoundingClientRect();
                start = new Rect(or.left, or.top, or.width, or.height);
            }
        }

        const r = element.getBoundingClientRect();
        const hr = new Rect(r.left, r.top, r.width, r.height);
        const hw2 = Math.round(hr.w / 2);
        const hh2 = Math.round(hr.h / 2);
        this._renderer.setStyle(dialog, 'position', 'absolute');
        if (!start) {
            cfg.position = 'center';
            start = new Rect(hw2 - 1, hh2 - 1, 2, 2);
        }
        dialogRef.origin = start;

        let end: Rect;
        if (cfg.position == 'fill') {
            this._renderer.setStyle(dialog, 'left', `${cfg.fillPadding}px`);
            this._renderer.setStyle(dialog, 'top', `${cfg.fillPadding}px`);
            this._renderer.setStyle(dialog, 'right', `${cfg.fillPadding}px`);
            this._renderer.setStyle(dialog, 'bottom', `${cfg.fillPadding}px`);
            end = new Rect(cfg.fillPadding, cfg.fillPadding, r.width - cfg.fillPadding * 2, r.height - cfg.fillPadding * 2);
        }
        else if (cfg.position == 'point') {
            this._renderer.setStyle(dialog, 'left', `${start.x}px`);
            this._renderer.setStyle(dialog, 'top', `${start.y}px`);
            if (cfg.minWidth) {
                this._renderer.setStyle(dialog, 'min-width', `${cfg.minWidth}px`);
            }
            if (cfg.maxWidth) {
                this._renderer.setStyle(dialog, 'max-width', `${cfg.maxWidth}px`);
            }
            if (cfg.minHeight) {
                this._renderer.setStyle(dialog, 'min-height', `${cfg.minHeight}px`);
            }
            if (cfg.maxHeight) {
                this._renderer.setStyle(dialog, 'max-height', `${cfg.maxHeight}px`);
            }
            end = new Rect(
                start.x,
                start.y,
                start.x + (cfg.minWidth || cfg.maxWidth || 10),
                start.y + (cfg.minHeight || cfg.maxHeight || 10)
            );
        }
        else {
            if (cfg.minWidth) {
                this._renderer.setStyle(dialog, 'min-width', `${cfg.minWidth}px`);
            }
            if (cfg.maxWidth) {
                this._renderer.setStyle(dialog, 'max-width', `${cfg.maxWidth}px`);
            }
            if (cfg.minHeight) {
                this._renderer.setStyle(dialog, 'min-height', `${cfg.minHeight}px`);
            }
            if (cfg.maxHeight) {
                this._renderer.setStyle(dialog, 'max-height', `${cfg.maxHeight}px`);
            }
        }
        this._renderer.setStyle(dialog, 'opacity', 0);
        if (cfg.animOpen) {
            this._renderer.setStyle(dialog, 'transition', `opacity ${at}ms ${cfg.animOpenFn}`);
        }
        this._renderer.appendChild(wrapper, dialog);
        setTimeout(() => { // TODO: find out how to correctly detect when view is fully rendered
            const dbb = dialog.getBoundingClientRect();
            const dx = Math.round((hr.w - dbb.width) / 2);
            const dy = Math.round((hr.h - dbb.height) / 2);
            if (cfg.position == 'center') {
                this._renderer.setStyle(dialog, 'left', `${dx}px`);
                this._renderer.setStyle(dialog, 'top', `${dy}px`);
            }
            if (cfg.animOpen && backdrop) {
                this._renderer.setStyle(backdrop, 'opacity', cfg.backdropOpacity);
            }
            if (cfg.animOpen && animbox && at > 40) {
                const r1 = start;
                const r2 = new Rect(dx, dy, dbb.width, dbb.height);
                animbox.animate(
                    [
                        { top: `${r1.y}px`, left: `${r1.x}px`, width: `${r1.w}px`, height: `${r1.h}px`, opacity: .1 },
                        { offset: 1, top: `${r2.y}px`, left: `${r2.x}px`, width: `${r2.w}px`, height: `${r2.h}px`, opacity: 1 }
                    ],
                    { duration: at - 40, delay: 10, endDelay: at, easing: cfg.animOpenFn }
                );
                setTimeout(() => this._renderer.setStyle(dialog, 'opacity', 1), at - 50);
            }
            else {
                this._renderer.setStyle(dialog, 'opacity', 1);
            }
        });
    }

    private _hideDialog<T>(dialogRef: DmDialogRef<T>): void {
        const cfg = dialogRef.config;
        if (!cfg.animClose || !(cfg.animCloseDuration > 80) || !cfg.origin || !dialogRef.animboxElement) {
            this._remove(dialogRef);
            return;
        }
        const dialog = this._getHostElement(dialogRef.componentRef);
        const at = Math.round(cfg.animCloseDuration / 2);
        const dbb = dialog.getBoundingClientRect();
        this._renderer.setStyle(dialog, 'transition', `opacity ${at}ms ${cfg.animCloseFn}`);
        if (dialogRef.backdropElement) {
            this._renderer.setStyle(dialogRef.backdropElement, 'transition', `opacity ${at}ms ${cfg.animCloseFn}`);
            this._renderer.setStyle(dialogRef.backdropElement, 'opacity', 0);
        }
        const r1 = new Rect(dbb.left, dbb.top, dbb.width, dbb.height);
        const r2 = new Rect(dialogRef.origin.x, dialogRef.origin.y, 2, 2);
        setTimeout(() => {
            this._renderer.setStyle(dialog, 'opacity', 0);
            setTimeout(() => {
                dialogRef.animboxElement.animate(
                    [
                        { top: `${r1.y}px`, left: `${r1.x}px`, width: `${r1.w}px`, height: `${r1.h}px`, opacity: 1 },
                        { offset: 1, top: `${r2.y}px`, left: `${r2.x}px`, width: `${r2.w}px`, height: `${r2.h}px`, opacity: 0 }
                    ],
                    { duration: at - 40, delay: 10, endDelay: at, easing: cfg.animCloseFn }
                );
            }, at / 2);
            setTimeout(() => this._remove(dialogRef), cfg.animCloseDuration);
        });
    }

}
