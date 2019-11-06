import { fakeAsync, flush } from '@angular/core/testing';
import { SpectatorHost, createHostFactory } from '@ngneat/spectator/jest';

import { DmDialogService } from '../dm-dialog.service';
import { DmDialogComponent } from './dm-dialog.component';

describe('DmDialogComponent', () => {
    let spectator: SpectatorHost<DmDialogComponent>;
    const createHost = createHostFactory({
        component: DmDialogComponent,
        providers: [DmDialogService]
    });

    it('should be created', fakeAsync(() => {
        spectator = createHost(`<dm-dialog></dm-dialog>`);
        expect(spectator.component).toBeTruthy();
        flush();
        spectator.detectChanges();
        expect(spectator.query('.dm-dialog-root')).toExist();
    }));

});
