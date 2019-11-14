import { Point, Rect } from './_utils';

export interface IDmDialogConfig {
    backdrop?: boolean;
    backdropOpacity?: number;
    draggable?: boolean;
    resizable?: boolean;
    position?: 'center' | 'fill' | 'point';
    positionPadding?: number;
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
    backdropClass?: string;
    dialogClass?: string;
}

const CONFIG_FIELDS = [
    'backdrop', 'backdropOpacity', 'draggable', 'resizeable', 'position',
    'positionPadding', 'origin', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
    'animOpen', 'animOpenDuration', 'animClose', 'animCloseDuration',
    'hostClass', 'backdropClass', 'dialogClass'
];

export class DmDialogConfig implements IDmDialogConfig {
    backdrop: boolean = true;
    backdropOpacity: number = .5;
    draggable: boolean = true;
    resizable: boolean = false;
    position: 'center' | 'fill' | 'point' = 'center';
    positionPadding: number = 0;
    origin: Element | Point | Rect;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    animOpen: boolean = true;
    animOpenDuration: number = 600;
    animOpenFn: string = 'cubic-bezier(.82,.01,.26,1)';
    animClose: boolean = true;
    animCloseDuration: number = 600;
    animCloseFn: string = 'cubic-bezier(.82,.01,.26,1)';
    hostClass: string;
    backdropClass: string;
    dialogClass: string;

    constructor(json?: IDmDialogConfig) {
        this.apply(json);
    }

    apply(json?: IDmDialogConfig): DmDialogConfig {
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
