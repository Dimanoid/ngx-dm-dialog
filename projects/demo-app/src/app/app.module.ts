import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import { DmDividerModule } from './dm-divider.module';
import { DmDialogModule } from '@dimanoid/ngx-dm-dialog';

import { AppComponent } from './app.component';
import { Dialog1Component } from './dialog1.component';
import { Dialog2Component } from './dialog2.component';

@NgModule({
    declarations: [
        AppComponent,
        Dialog1Component,
        Dialog2Component
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
        Dialog1Component, Dialog2Component
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
