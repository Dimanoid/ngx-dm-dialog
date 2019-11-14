import { ComponentRef, EmbeddedViewRef } from '@angular/core';

export function getHostElement(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
}
