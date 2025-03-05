import { writeFile } from 'fs/promises';
import { readFileSync } from 'fs';
import { join } from 'path';
export async function generateClientFile(id: number): Promise<string> {
    // TODO: try to compile this in binary
    const templatePath = join(__dirname, 'client_template.ts');
    const template = readFileSync(templatePath, 'utf8');
    const clientCode = template.replace('CLIENT_ID_PLACEHOLDER', id.toString());

    const fileName = `client_${id}.ts`;
    await writeFile(fileName, clientCode);

    return fileName;
}
