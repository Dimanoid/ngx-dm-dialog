import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
import {
    NZ_I18N, en_US,
    NzSwitchModule,
    NzSelectModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzButtonModule,
    NzInputModule,
    NzInputNumberModule
} from 'ng-zorro-antd';

import { DmDividerModule } from './dm-divider.module';
import { DmDialogModule } from '@dimanoid/ngx-dm-dialog';

import { AppComponent } from './app.component';
import { Dialog1Component } from './dialog1.component';

@NgModule({
    declarations: [
        AppComponent,
        Dialog1Component
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, CommonModule,
        FormsModule, ReactiveFormsModule,
        NzSwitchModule, NzSelectModule, NzToolTipModule, NzCheckboxModule, NzButtonModule,
        NzInputModule, NzInputNumberModule,
        DmDividerModule, DmDialogModule
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
    ],
    entryComponents: [
        Dialog1Component
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
