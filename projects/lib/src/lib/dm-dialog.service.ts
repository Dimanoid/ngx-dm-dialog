import {
    Injectable,
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    EmbeddedViewRef
} from '@angular/core';

export type ComponentType<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class DmDialogService {

    constructor(
        private _appRef: ApplicationRef,
        private _resolver: ComponentFactoryResolver,
        private _injector: Injector
    ) { }

    private _dialogs: ComponentRef<any>[] = [];

    add<T>(component: ComponentType<T> | ComponentRef<T>, element?: Element | string): ComponentRef<T> {
        const componentRef = component instanceof ComponentRef
            ? component
            : this._resolver.resolveComponentFactory(component).create(this._injector);
        this._appRef.attachView(componentRef.hostView);
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (!element) {
            element = document.body;
        }
        element.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);
        this._dialogs.push(componentRef);
        return componentRef;
    }

    remove(dialog: number | ComponentRef<any>): boolean {
        let componentRef;
        if (typeof dialog === 'number' && this._dialogs.length > dialog)  {
            componentRef = this._dialogs.splice(dialog, 1)[0];
        }
        else {
            for (const cr of this._dialogs) {
                if (cr === dialog) {
                    componentRef = cr;
                }
            }
        }
        if (componentRef) {
            this._remove(componentRef);
            return true;
        }
        return false;
    }

    private _remove(componentRef: ComponentRef<any>) {
        this._appRef.detachView(componentRef.hostView);
        componentRef.destroy();
    }

    clear() {
        while (this._dialogs.length > 0) {
            this._remove(this._dialogs.pop());
        }
    }

    getIndex(componentRef: ComponentRef<any>): number {
        return this._dialogs.indexOf(componentRef);
    }

}
