import { Component, Input } from '@angular/core';

@Component({
    template: `
    <div style="width: 400px; height: 300px; background: #FFC; border: 1px solid #800; position: absolute; top: 350px; left: 150px; z-index: 7777; box-shadow: 1px 1px 5px 3px #ccc; padding: 10px">
        Dialog 1 - text: {{ text }}
    </div>`
})
export class Dialog1Component {
    @Input() text: string;

    constructor() { }

}
