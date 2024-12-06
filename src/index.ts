import fs from 'fs';
import util from 'util';
import path from 'path';
import { ReportManager } from "made-report-lib";
import axios from 'axios';

const readFileAsync = util.promisify(fs.readFile);

interface PathConfig {
    path: string;
    webhook: string;
  }

async function enviarMensagemDiscord(mensagem: string, WEBHOOK_URL:string) {
    try {
        const response = await axios.post(WEBHOOK_URL, {
            content: mensagem
        });
        
        if (response.status === 204) {
            console.log('Mensagem enviada com sucesso!');
            return true;
        }
    } catch (erro) {
        console.error('Erro ao enviar mensagem:', erro);
        return false;
    }
}

async function readPathsFromJson(filePath: string): Promise<PathConfig[]> {
    try {
        const fileContent = await readFileAsync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Ajusta os caminhos para o contêiner e mantém o webhook
        const containerConfigs = data.map((item: PathConfig) => ({
            path: path.resolve('/host', item.path),
            webhook: item.webhook
        }));

        return containerConfigs;
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
    
            const pathConfigs = await readPathsFromJson(filePath);
    
            console.log("Configurações carregadas:");
            pathConfigs.forEach((config) => console.log(`Path: ${config.path}, Webhook: ${config.webhook}`));
    
            // Processar cada diretório e enviar para seu respectivo webhook
            for (const config of pathConfigs) {
                const report = new ReportManager();
                
                report.createReport(config.path);
                console.log(`Criando os Reports para: ${config.path}`);
    
                const msg = await report.createSprintSummaryReport(config.path);
                await enviarMensagemDiscord(msg, config.webhook);
            }
        } catch (error) {
            console.error("Erro na execução:", error);
        }
    }

main();
