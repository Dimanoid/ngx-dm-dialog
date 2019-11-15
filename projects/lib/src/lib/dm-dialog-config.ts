import { Point, Rect } from './_utils';

export interface IDmDialogConfig {
    backdrop?: boolean;
    backdropOpacity?: number;
    position?: 'center' | 'fill' | 'point';
    positionPadding?: number;
    origin?: Element | Point | Rect;
    animOpen?: boolean;
    animOpenDuration?: number;
    animOpenFn?: string;
    animClose?: boolean;
    animCloseDuration?: number;
    animCloseFn?: string;
    hostClass?: string;
    backdropClass?: string;
    dialogClass?: string;
    dialogDraggable?: boolean;
    dialogResizable?: boolean;
    dialogShowCloseButton?: boolean;
    dialogShowMaximizeButton?: boolean;
    dialogKeepInBoundaries?: boolean;
    dialogContentMinWidth?: number;
    dialogContentMaxWidth?: number;
    dialogContentMinHeight?: number;
    dialogContentMaxHeight?: number;
}

const CONFIG_FIELDS = [
    'backdrop', 'backdropOpacity', 'position', 'positionPadding', 'origin',
    'animOpen', 'animOpenDuration', 'animClose', 'animCloseDuration', 'hostClass', 'backdropClass', 'dialogClass',
    'dialogDraggable', 'dialogResizable', 'dialogShowCloseButton', 'dialogShowMaximizeButton', 'dialogKeepInBoundaries',
    'dialogContentMinWidth', 'dialogContentMaxWidth', 'dialogContentMinHeight', 'dialogContentMaxHeight'
];

export class DmDialogConfig implements IDmDialogConfig {
    backdrop: boolean = true;
    backdropOpacity: number = .5;
    position: 'center' | 'fill' | 'point' = 'center';
    positionPadding: number = 0;
    origin: Element | Point | Rect;
    animOpen: boolean = true;
    animOpenDuration: number = 600;
    animOpenFn: string = 'cubic-bezier(.82,.01,.26,1)';
    animClose: boolean = true;
    animCloseDuration: number = 600;
    animCloseFn: string = 'cubic-bezier(.82,.01,.26,1)';
    hostClass: string;
    backdropClass: string;
    dialogClass: string;
    dialogDraggable: boolean = true;
    dialogResizable: boolean = false;
    dialogShowCloseButton: boolean = true;
    dialogShowMaximizeButton: boolean = false;
    dialogKeepInBoundaries: boolean = false;
    dialogContentMinWidth: number;
    dialogContentMaxWidth: number;
    dialogContentMinHeight: number;
    dialogContentMaxHeight: number;

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
