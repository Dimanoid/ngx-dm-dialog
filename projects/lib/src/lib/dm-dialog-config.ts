export interface IDmDialogConfig {
    draggable?: boolean;
    resizable?: boolean;
    showCloseButton?: boolean;
    showMaximizeButton?: boolean;
    keepInBoundaries?: boolean;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
}

const CONFIG_FIELDS = [
    'draggable', 'resizable', 'showCloseButton', 'showMaximizeButton', 'keepInBoundaries',
    'mMinWidth', 'maxWidth', 'minHeight', 'maxHeight'
];

export class DmDialogConfig implements IDmDialogConfig {
    draggable: boolean = true;
    resizable: boolean = false;
    showCloseButton: boolean = true;
    showMaximizeButton: boolean = false;
    keepInBoundaries: boolean = false;
    minWidth: number = 250;
    maxWidth: number;
    minHeight: number = 200;
    maxHeight: number;

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
