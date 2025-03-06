const { writeFile } = require('fs/promises');
const { readFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');
const { unlink } = require('fs/promises');

async function generateClientFile(id) {
    try {
        const templatePath = join(__dirname, 'client_template.js');
        const template = readFileSync(templatePath, 'utf8');
        const clientCode = template.replace('CLIENT_ID_PLACEHOLDER', id.toString());

        const fileName = `client_${id}.js`;
        await writeFile(fileName, clientCode);

        const binaryFile = `client_${id}`;
        const outputPath = __dirname;
        execSync(
            `pkg ${fileName} --targets node16-linux-x64 --output ${join(outputPath, binaryFile)}`,
            {
                stdio: 'inherit',
            },
        );

        const binaryFullPath = join(outputPath, binaryFile);
        await unlink(fileName);
        return binaryFullPath;
    } catch (error) {
        throw error;
    }
}

module.exports = { generateClientFile };
