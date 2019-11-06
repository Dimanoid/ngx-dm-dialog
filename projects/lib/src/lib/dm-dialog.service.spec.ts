import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { DmDialogService } from './dm-dialog.service';

describe('DmDialogService', () => {
    let spectator: SpectatorService<DmDialogService>;
    const createService = createServiceFactory(DmDialogService);

    beforeEach(() => spectator = createService());

    it('should be created', () => {
        expect(spectator.service).toBeTruthy();
    });

    it('should not has default value', () => {
        const v = spectator.service.getValue();
        expect(v).toBeUndefined();
    });

    it('should set new value', () => {
        spectator.service.setValue(42);
        const v = spectator.service.getValue();
        expect(v).toEqual(42);
    });
});
