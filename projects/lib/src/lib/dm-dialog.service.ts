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
            this._remove(this._dialogs[id]);
            delete this._dialogs[id];
            return true;
        }
        return false;
    }

    private _remove<T>(dialogRef: DmDialogRef<T>) {
        this._appRef.detachView(dialogRef.componentRef.hostView);
        dialogRef.componentRef.destroy();
        this._renderer.removeChild(this._renderer.parentNode(dialogRef.backdropElement), dialogRef.backdropElement);
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
        if (dialogRef.config.backdrop) {
            const wrapper = this._renderer.createElement('div');
            this._renderer.setStyle(wrapper, 'position', 'absolute');
            this._renderer.setStyle(wrapper, 'top', 0);
            this._renderer.setStyle(wrapper, 'right', 0);
            this._renderer.setStyle(wrapper, 'bottom', 0);
            this._renderer.setStyle(wrapper, 'left', 0);
            this._renderer.setStyle(wrapper, 'opacity', dialogRef.config.backdropOpacity);
            this._renderer.addClass(wrapper, 'ngx-dm-dialog-backdrop');
            this._renderer.appendChild(element, wrapper);
            dialogRef.backdropElement = wrapper;
        }

        const hostView = this._getHostElement(dialogRef.componentRef);
        const cfg = dialogRef.config;
        if (cfg.hostClass) {
            this._renderer.addClass(hostView, cfg.hostClass);
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
        this._renderer.setStyle(hostView, 'position', 'absolute');
        if (!start) {
            cfg.position = 'center';
            start = new Rect(hw2 - 1, hh2 - 1, 2, 2);
        }

        let end: Rect;
        if (cfg.position == 'fill') {
            this._renderer.setStyle(hostView, 'left', `${cfg.fillPadding}px`);
            this._renderer.setStyle(hostView, 'top', `${cfg.fillPadding}px`);
            this._renderer.setStyle(hostView, 'right', `${cfg.fillPadding}px`);
            this._renderer.setStyle(hostView, 'bottom', `${cfg.fillPadding}px`);
            end = new Rect(cfg.fillPadding, cfg.fillPadding, r.width - cfg.fillPadding * 2, r.height - cfg.fillPadding * 2);
        }
        else if (cfg.position == 'point') {
            this._renderer.setStyle(hostView, 'left', `${start.x}px`);
            this._renderer.setStyle(hostView, 'top', `${start.y}px`);
            if (cfg.minWidth) {
                this._renderer.setStyle(hostView, 'min-width', `${cfg.minWidth}px`);
            }
            if (cfg.maxWidth) {
                this._renderer.setStyle(hostView, 'max-width', `${cfg.maxWidth}px`);
            }
            if (cfg.minHeight) {
                this._renderer.setStyle(hostView, 'min-height', `${cfg.minHeight}px`);
            }
            if (cfg.maxHeight) {
                this._renderer.setStyle(hostView, 'max-height', `${cfg.maxHeight}px`);
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
                this._renderer.setStyle(hostView, 'min-width', `${cfg.minWidth}px`);
            }
            if (cfg.maxWidth) {
                this._renderer.setStyle(hostView, 'max-width', `${cfg.maxWidth}px`);
            }
            if (cfg.minHeight) {
                this._renderer.setStyle(hostView, 'min-height', `${cfg.minHeight}px`);
            }
            if (cfg.maxHeight) {
                this._renderer.setStyle(hostView, 'max-height', `${cfg.maxHeight}px`);
            }
        }
        this._renderer.setStyle(hostView, 'opacity', 0);
        this._renderer.appendChild(element, hostView);
        if (cfg.position == 'center') {
            setTimeout(() => { // TODO: find out how to correctly detect when view is fully rendered
                const dbb = hostView.getBoundingClientRect();
                this._renderer.setStyle(hostView, 'left', Math.round((hr.w - dbb.width) / 2) + 'px');
                this._renderer.setStyle(hostView, 'top', Math.round((hr.h - dbb.height) / 2) + 'px');
                this._renderer.setStyle(hostView, 'opacity', 1);
            });
        }
    }

    private _animateDialogOpening(duration: number): void {
        // const e1 = this._rb.nativeElement;
        // const e2 = this._bb.nativeElement;
        // const r1 = pe.getBoundingClientRect();
        // const r2 = e2.getBoundingClientRect();
        // e1.style.display = 'block';
        // e1.animate(
        //     [
        //         {
        //             top: r1.top + 'px',
        //             left: r1.left + 'px',
        //             width: r1.width + 'px',
        //             height: r1.height + 'px',
        //             opacity: .5
        //         },
        //         {
        //             offset: .4,
        //             top: (r1.top - 10) + 'px',
        //             left: (r1.left - 10) + 'px',
        //             width: (r1.width + 20) + 'px',
        //             height: (r1.height + 20) + 'px',
        //             opacity: 1
        //         },
        //         {
        //             offset: .6,
        //             top: (r1.top - 10) + 'px',
        //             left: (r1.left - 10) + 'px',
        //             width: (r1.width + 20) + 'px',
        //             height: (r1.height + 20) + 'px',
        //             opacity: 1
        //         },
        //         {
        //             offset: .9,
        //             top: r2.top + 'px',
        //             left: r2.left + 'px',
        //             width: r2.width + 'px',
        //             height: r2.height + 'px',
        //             opacity: .7
        //         },
        //         {
        //             offset: 1,
        //             top: r2.top + 'px',
        //             left: r2.left + 'px',
        //             width: r2.width + 'px',
        //             height: r2.height + 'px',
        //             opacity: 0
        //         }
        //     ],
        //     { duration, delay: 10, endDelay: 30, easing: 'cubic-bezier(.19, 1, .22, 1)' }
        // );
    }

}
