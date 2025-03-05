import { exec } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { readFileSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function generateClientFile(id: number): Promise<string> {
    const templatePath = join(__dirname, 'client_template.ts');
    const template = readFileSync(templatePath, 'utf8');
    const clientCode = template.replace('CLIENT_ID_PLACEHOLDER', id.toString());

    const fileName = `client_${id}.ts`;
    await writeFile(fileName, clientCode);

    const compiledFile = `Remote_Configuration_${id}`;
    await execPromise(`bun build --compile ${fileName} --outfile ${compiledFile}`);

    await unlink(fileName);

    return compiledFile;
}
