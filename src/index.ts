import fs from 'fs';
import util from 'util';
import path from 'path';
import { ReportManager } from "made-report-lib";
const readFileAsync = util.promisify(fs.readFile);

async function readPathsFromJson(filePath: string): Promise<string[]> {
    try {
        const fileContent = await readFileAsync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Ajusta os caminhos para o contêiner
        const containerPaths = data.map((item: { path: string }) =>
            path.resolve('/host', item.path)
        );

        return containerPaths;
    } catch (error) {
        console.error("Erro ao ler o arquivo JSON:", error);
        throw error;
    }
}

export async function main() {
    try {
        const filePath = process.env.JSON_FILE_PATH;

        if (!filePath) {
            throw new Error('Variável de ambiente JSON_FILE_PATH não definida');
        }

        const paths = await readPathsFromJson(filePath);

        console.log("Paths absolutos no contêiner:");
        paths.forEach((containerPath) => console.log(containerPath));

        // Exemplo: Modificar arquivos nos diretórios
        paths.forEach((dir) => {
            const report = new ReportManager();
            report.createReport(dir);
            console.log(`Modificando arquivos em: ${dir}`);
        });
    } catch (error) {
        console.error("Erro na execução:", error);
    }
}

main();
