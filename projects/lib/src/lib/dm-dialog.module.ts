import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DmDialogComponent } from './dialog/dm-dialog.component';

@NgModule({
    declarations: [
        DmDialogComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DmDialogComponent
    ]
})
export class DmDialogModule { }
