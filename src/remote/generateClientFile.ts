import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export const generateClientFile = (id: number): string => {
    const templatePath = join(__dirname, 'client_template.ts');
    const template = readFileSync(templatePath, 'utf8');
    const clientCode = template.replace('CLIENT_ID_PLACEHOLDER', id.toString());
    const fileName = `Remote_Configuration.ts`;
    writeFileSync(fileName, clientCode);
    return fileName;
};
