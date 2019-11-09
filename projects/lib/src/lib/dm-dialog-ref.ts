import { DmDialogConfig } from './dm-dialog-config';
import { ComponentRef } from '@angular/core';

export class DmDialogRef<T> {
    id: number;
    options: DmDialogConfig;
    componentRef: ComponentRef<T>;
}
