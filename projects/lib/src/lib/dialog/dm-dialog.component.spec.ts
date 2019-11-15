import { fakeAsync, flush } from '@angular/core/testing';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator/jest';

import { DmDialogService } from '../dm-dialog.service';
import { DmDialogComponent } from './dm-dialog.component';
import { DmDialogRef } from '../dm-dialog-ref';
import { DmDialogConfig } from '../dm-dialog-config';

describe('DmDialogComponent', () => {
    let spectator: SpectatorHost<DmDialogComponent>;
    const dialogRef = new DmDialogRef<DmDialogComponent>();
    dialogRef.config = new DmDialogConfig();
    const createHost = createHostFactory({
        component: DmDialogComponent,
        providers: [
            DmDialogService,
            { provide: DmDialogRef, useValue: dialogRef }
        ]
    });

    it('should be created', fakeAsync(() => {
        spectator = createHost(`<dm-dialog></dm-dialog>`);
        expect(spectator.component).toBeTruthy();
        flush();
        spectator.detectChanges();
        expect(spectator.query('.ngx-dmd-container-inner')).toExist();
    }));

});
