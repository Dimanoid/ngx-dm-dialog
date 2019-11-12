import { IDmDialogConfig } from './dm-dialog-config';
import { ComponentRef } from '@angular/core';
import { Rect } from './_utils';

export class DmDialogRef<T> {
    id: number;
    config: IDmDialogConfig;
    componentRef: ComponentRef<T>;
    wrapperElement: Element;
    backdropElement: Element;
    animboxElement: Element;
    origin: Rect;
}
