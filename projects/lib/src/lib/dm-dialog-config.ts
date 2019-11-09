const CONFIG_FIELDS = [
    'backdrop', 'backdropOpacity', 'draggable', 'resizeable', 'position'
];

export class DmDialogConfig {
    backdrop: boolean = true;
    backdropOpacity: number = .7;
    draggable: boolean = true;
    resizeable: boolean = false;
    position: 'center' | 'fill' | 'point' = 'center';

    constructor(json?: any) {
        if (!json || typeof json !== 'object') {
            return;
        }
        for (const fn of CONFIG_FIELDS) {
            if (json[fn] !== undefined) {
                this[fn] = json[fn];
            }
        }
    }
}