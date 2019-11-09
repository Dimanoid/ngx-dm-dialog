import {
    Injectable,
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    EmbeddedViewRef,
    TemplateRef
} from '@angular/core';

import { DmDialogRef } from './dm-dialog-ref';
import { DmDialogConfig } from './dm-dialog-config';
import { DmTemplateWrapperComponent } from './template-wrapper.component';

export type ComponentType<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class DmDialogService {
    private _lastId = 1;
    private _dialogs: { [id: string]: DmDialogRef<any> } = {};
    private _globalConfig: DmDialogConfig = new DmDialogConfig();

    constructor(
        private _appRef: ApplicationRef,
        private _resolver: ComponentFactoryResolver,
        private _injector: Injector
    ) { }

    add<T>(
        dialog: ComponentType<T> | ComponentRef<T> | TemplateRef<T>,
        options?: {
            config?: DmDialogConfig,
            templateContext?: any,
            hostView?: Element | string
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
        element = typeof options.hostView === 'string' ? document.querySelector(options.hostView) : options.hostView;
        if (!element) {
            element = document.body;
        }
        this._showDialog(dialogRef, element);

        this._dialogs[dialogRef.id] = dialogRef;
        return dialogRef;
    }

    remove(id: number): boolean {
        if (this._dialogs[id]) {
            this._remove(this._dialogs[id].componentRef);
            return true;
        }
        return false;
    }

    private _remove(componentRef: ComponentRef<any>) {
        this._appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }

    clear() {
         Object.keys(this._dialogs).forEach(id => {
             this._remove(this._dialogs[id].componentRef);
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
        if (dialogRef.config.animOpen) {
            this._animateDialogOpening(dialogRef.config.animOpenDuration);
        }
        element.appendChild(this._getHostElement(dialogRef.componentRef));
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
