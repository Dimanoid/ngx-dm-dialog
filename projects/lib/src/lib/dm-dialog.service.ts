import {
    Injectable,
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    EmbeddedViewRef
} from '@angular/core';
import { DmDialogRef } from './dm-dialog-ref';

export type ComponentType<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class DmDialogService {
    private _dialogs: { [id: string]: DmDialogRef<any> } = {};

    constructor(
        private _appRef: ApplicationRef,
        private _resolver: ComponentFactoryResolver,
        private _injector: Injector
    ) { }


    add<T>(component: ComponentType<T> | ComponentRef<T>, element?: Element | string): DmDialogRef<T> {
        const dialogRef = new DmDialogRef<T>();
        const dialogInjector = Injector.create({
            providers: [
                { provide: DmDialogRef, useValue: dialogRef }
            ],
            parent: this._injector
        });
        const componentRef = component instanceof ComponentRef
            ? component
            : this._resolver.resolveComponentFactory(component).create(dialogInjector);
        dialogRef.componentRef = componentRef;
        this._appRef.attachView(componentRef.hostView);
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (!element) {
            element = document.body;
        }
        element.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);
        this._dialogs[dialogRef.id] = dialogRef;
        return dialogRef;
    }

    remove(id: string): boolean {
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

}
