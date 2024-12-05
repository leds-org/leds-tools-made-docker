import { ReportManager } from "made-report-lib"
import fs from 'fs';
import util from 'util';

const readFileAsync = util.promisify(fs.readFile);

interface Directory {
    path: string;
}

async function readDirectoriesFromJson(filePath: string): Promise<Directory[]> {
    try {
        // Lê o conteúdo do arquivo
        const fileContent = await readFileAsync(filePath, 'utf-8');
        
        // Converte o JSON para objeto
        const directories: Directory[] = JSON.parse(fileContent);
        
        return directories;
    } catch (error) {
        throw error;
    }
}

export async function main() {
    try {
        const directories = await readDirectoriesFromJson('./directories.json');
        const report = new ReportManager ()
    
            
        // Exemplo de como processar os diretórios
        directories.forEach(dir => {
            if (dir.path) {
                report.createReport(dir.path)
            }
        });
    } catch (error) {
    }
}


