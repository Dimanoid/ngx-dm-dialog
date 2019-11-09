import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DmDialogComponent } from './dialog/dm-dialog.component';
import { DmTemplateWrapperComponent } from './template-wrapper.component';

@NgModule({
    declarations: [
        DmDialogComponent,
        DmTemplateWrapperComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        DmDialogComponent
    ]
})
export class DmDialogModule { }
