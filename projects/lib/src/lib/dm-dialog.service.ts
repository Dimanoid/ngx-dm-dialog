import {
    Injectable,
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    EmbeddedViewRef
} from '@angular/core';
import { _L } from './utils';

export type ComponentType<T> = new (...args: any[]) => T;

@Injectable({
    providedIn: 'root'
})
export class DmDialogService {

    constructor(
        private _appRef: ApplicationRef,
        private _resolver: ComponentFactoryResolver,
        private _injector: Injector
    ) {
        _L('constructor', '_appRef:', this._appRef);
    }

    add<T>(component: ComponentType<T>, element?: Element): ComponentRef<T> {
        const componentFactory = this._resolver.resolveComponentFactory(component);
        const componentRef = componentFactory.create(this._injector);
        this._appRef.attachView(componentRef.hostView);
        // this.setDisposeFn(() => {
        //   this._appRef.detachView(componentRef.hostView);
        //   componentRef.destroy();
        // });
        if (!element) {
            element = document.body;
        }
        element.appendChild(this._getComponentRootNode(componentRef));
        return componentRef;
    }

    private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }

}
