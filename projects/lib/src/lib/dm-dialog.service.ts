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
    private _globalConfig: DmDialogConfig;

    constructor(
        private _appRef: ApplicationRef,
        private _resolver: ComponentFactoryResolver,
        private _injector: Injector
    ) { }

    add<T>(
        component: ComponentType<T> | ComponentRef<T> | TemplateRef<T>,
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
        const dialogInjector = Injector.create({
            providers: [
                { provide: DmDialogRef, useValue: dialogRef }
            ],
            parent: this._injector
        });

        let componentRef: ComponentRef<any>;
        if (component instanceof ComponentRef) {
            componentRef = component;
        }
        else if (component instanceof TemplateRef) {
            componentRef = this._resolver.resolveComponentFactory(DmTemplateWrapperComponent).create(dialogInjector);
            componentRef.instance.template = component;
            componentRef.instance.context = options.templateContext;
        }
        else {
            componentRef = this._resolver.resolveComponentFactory(component).create(dialogInjector);
        }
        dialogRef.componentRef = componentRef;
        this._appRef.attachView(componentRef.hostView);

        let element: Element;
        element = typeof options.hostView === 'string' ? document.querySelector(options.hostView) : options.hostView;
        if (!element) {
            element = document.body;
        }
        element.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);

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

}
