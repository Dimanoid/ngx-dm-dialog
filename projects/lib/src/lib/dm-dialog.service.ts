import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DmDialogService {

    value: any;

    constructor() { }

    setValue(v: any) {
        this.value = v;
    }

    getValue(): any {
        return this.value;
    }

}
