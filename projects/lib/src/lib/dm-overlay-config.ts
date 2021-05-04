import { Point, Rect } from './_utils';

export interface IDmOverlayConfig {
    wrapper?: boolean;
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
    hostClass?: string | string[];
    backdropClass?: string | string[];
    dialogClass?: string | string[];
}

const CONFIG_FIELDS = [
    'wrapper', 'backdrop', 'backdropOpacity', 'position', 'positionPadding', 'origin',
    'animOpen', 'animOpenDuration', 'animOpenFn', 'animClose', 'animCloseDuration',
    'animCloseFn', 'hostClass', 'backdropClass', 'dialogClass'
];

export class DmOverlayConfig implements IDmOverlayConfig {
    wrapper: boolean = true;
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

    constructor(json?: IDmOverlayConfig) {
        this.apply(json);
    }

    apply(json?: IDmOverlayConfig): DmOverlayConfig {
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
