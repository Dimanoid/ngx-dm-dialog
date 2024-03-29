import { IDmOverlayConfig } from './dm-overlay-config';
import { ComponentRef } from '@angular/core';
import { Rect } from './_utils';
import { Observable } from 'rxjs';

export class DmDialogRef<T> {
    id: number;
    config: IDmOverlayConfig;
    componentRef: ComponentRef<T>;
    wrapperElement: Element;
    backdropElement: Element;
    animboxElement: Element;
    origin: Rect;
    data: any;
    afterOpen: (dialogRef: DmDialogRef<T>) => void;
    canClose: (dialogRef: DmDialogRef<T>) => boolean | Observable<boolean>;
    afterClose: (dialogRef: DmDialogRef<T>) => void;
}
