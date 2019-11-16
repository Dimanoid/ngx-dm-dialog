export interface IDmDialogConfig {
    draggable?: boolean;
    resizable?: boolean;
    showCloseButton?: boolean;
    showMaximizeButton?: boolean;
    keepInBoundaries?: boolean;
    contentMinWidth?: number;
    contentMaxWidth?: number;
    contentMinHeight?: number;
    contentMaxHeight?: number;
}

const CONFIG_FIELDS = [
    'draggable', 'resizable', 'showCloseButton', 'showMaximizeButton', 'keepInBoundaries',
    'contentMinWidth', 'contentMaxWidth', 'contentMinHeight', 'contentMaxHeight'
];

export class DmDialogConfig implements IDmDialogConfig {
    draggable: boolean = true;
    resizable: boolean = false;
    showCloseButton: boolean = true;
    showMaximizeButton: boolean = false;
    keepInBoundaries: boolean = false;
    contentMinWidth: number;
    contentMaxWidth: number;
    contentMinHeight: number;
    contentMaxHeight: number;

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
