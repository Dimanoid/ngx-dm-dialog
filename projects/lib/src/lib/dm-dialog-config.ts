import { Point, Rect } from './_utils';

export interface IDmDialogConfig {
    backdrop?: boolean;
    backdropOpacity?: number;
    draggable?: boolean;
    resizeable?: boolean;
    position?: 'center' | 'fill' | 'point';
    fillPadding?: number;
    origin?: Element | Point | Rect;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    animOpen?: boolean;
    animOpenDuration?: number;
    animOpenFn?: string;
    animClose?: boolean;
    animCloseDuration?: number;
    animCloseFn?: string;
    hostClass?: string;
}

const CONFIG_FIELDS = [
    'backdrop', 'backdropOpacity', 'draggable', 'resizeable', 'position',
    'fillPadding', 'origin', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
    'animOpen', 'animOpenDuration', 'animClose', 'animCloseDuration',
    'hostClass'
];

export class DmDialogConfig implements IDmDialogConfig {
    backdrop: boolean = true;
    backdropOpacity: number = .3;
    draggable: boolean = true;
    resizeable: boolean = false;
    position: 'center' | 'fill' | 'point' = 'center';
    fillPadding: number = 0;
    origin: Element | Point | Rect;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    animOpen: boolean = true;
    animOpenDuration: number = 500;
    animOpenFn: string = 'cubic-bezier(.19, 1, .22, 1)';
    animClose: boolean = true;
    animCloseDuration: number = 500;
    animCloseFn: string = 'cubic-bezier(.19, 1, .22, 1)';
    hostClass: string;

    constructor(json?: any) {
        this.apply(json);
    }

    apply(json?: any): DmDialogConfig {
        if (json && typeof json === 'object') {
            for (const fn of CONFIG_FIELDS) {
                if (json[fn] !== undefined) {
                    this[fn] = json[fn];
                }
            }
        }
        return this;
    }
}
