const { writeFile } = require('fs/promises');
const { readFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');
const { unlink } = require('fs/promises');

async function generateClientFile(id, osType) {
    try {
        const templatePath = join(__dirname, 'client_template.js');

        const template = readFileSync(templatePath, 'utf8');
        const clientCode = template.replace('CLIENT_ID_PLACEHOLDER', id.toString());

        const fileName = `client_${id}.js`;
        await writeFile(fileName, clientCode);

        const binaryFile = join(__dirname, `client_${id}.${osType.type}`);

        //prettier-ignore
        execSync(`pkg ${fileName} --targets node16-${osType.os}-x64 --output ${binaryFile} --no-bytecode --public`, {stdio: 'inherit'});
        await unlink(fileName);

        return `${binaryFile}`;
    } catch (error) {
        throw error;
    }
}

module.exports = { generateClientFile };
