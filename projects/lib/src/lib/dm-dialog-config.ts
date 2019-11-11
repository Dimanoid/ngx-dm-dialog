import { Point, Rect } from './_utils';

const CONFIG_FIELDS = [
    'backdrop', 'backdropOpacity', 'draggable', 'resizeable', 'position',
    'origin', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
    'animOpen', 'animOpenDuration', 'animClose', 'animCloseDuration'
];

export class DmDialogConfig {
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
    animClose: boolean = true;
    animCloseDuration: number = 500;

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
