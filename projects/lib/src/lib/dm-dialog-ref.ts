import { DmDialogConfig } from './dm-dialog-config';
import { ComponentRef } from '@angular/core';
import { getUUID } from './_utils';

export class DmDialogRef<T> {
    id: string = getUUID();
    options: DmDialogConfig;
    componentRef: ComponentRef<T>;
}
