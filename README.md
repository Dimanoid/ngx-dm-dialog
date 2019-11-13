# ngx-dm-dialog

![npm version](https://img.shields.io/npm/v/@dimanoid/ngx-dm-dialog/latest) ![bundle size](https://img.shields.io/bundlephobia/min/@dimanoid/ngx-dm-dialog) ![build](https://travis-ci.com/Dimanoid/ngx-dm-dialog.svg?branch=release) [![Coverage Status](https://coveralls.io/repos/github/Dimanoid/ngx-dm-dialog/badge.svg?branch=release)](https://coveralls.io/github/Dimanoid/ngx-dm-dialog?branch=release)

Demo page: https://dimanoid.github.io/ngx-dm-dialog/

## Installation

Install the library and dependecies:

  `npm i -S resize-observer-polyfill @dimanoid/ngx-dm-dialog`

Add module to imports:

```ts
import { DmDialogModule } from '@dimanoid/ngx-dm-dialog';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, CommonModule,
        .......
        DmDialogModule  // <-------
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```


## API
<br>

### DmDialogComponent `<dm-dialog></dm-dialog>`

Property | Description | Type | Default value
---------|-------------|------|--------------

<br><br>
