import { sendCommand } from '../../server/server';

export const splittingCommand = (id: number, action: string, value: string): void => {
    console.log(1);
    const splitMessage: string[] = value.split(' ');
    const gottenValue: number = Number(splitMessage[1]);

    if (isNaN(gottenValue)) {
        throw new Error('Value must be a number');
    } else if (gottenValue < 0 || gottenValue > 100) {
        throw new Error('Invalid argument');
    } else {
        sendCommand(action, id, splitMessage[1]);
    }
};
