import { sendCommand } from '../../server/server';

export const splittingCommand = (id: number, action: string, value: string): void | string => {
    const splitMessage: string[] = value.split(' ');
    const gottenValue: number = Number(splitMessage[1]);

    if (isNaN(gottenValue)) {
        throw new Error('😡 Value must be a number in range [0; 100]!');
    } else if (gottenValue < 0 || gottenValue > 100) {
        throw new Error('💩 INVALID VALUE! 💩');
    } else {
        return sendCommand(action, id, splitMessage[1]);
    }
};
