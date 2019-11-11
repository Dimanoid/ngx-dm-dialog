import { IDmDialogConfig } from './dm-dialog-config';
import { ComponentRef } from '@angular/core';

export class DmDialogRef<T> {
    id: number;
    config: IDmDialogConfig;
    componentRef: ComponentRef<T>;
    backdropElement: Element;
}
