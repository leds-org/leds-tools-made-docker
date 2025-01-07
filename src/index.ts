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


/**
 * Formata e divide mensagens com tabelas markdown para o Discord
 * @param message Mensagem que pode conter tabelas markdown
 * @returns Array de mensagens formatadas
 */
function formatDiscordTableMessage(message: string): string[] {
    const MAX_LENGTH = 2000;
    
    // Detecta se há uma tabela markdown na mensagem
    const hasTable = message.includes('|') && message.includes('\n|');
    
    if (!hasTable) {
        // Se não há tabela, usa o splitter normal
        return splitMessageForDiscord(message);
    }

    // Encontra todas as tabelas na mensagem
    const tableRegex = /(\|[\s\S]+?\n)\n/g;
    const tables = [...message.matchAll(tableRegex)];
    
    if (!tables.length) {
        return splitMessageForDiscord(message);
    }

    // Processa a mensagem substituindo as tabelas por versões formatadas
    let formattedMessage = message;
    tables.forEach((match) => {
        const table = match[0];
        const formattedTable = '\n```markdown\n' + table.trim() + '\n```\n';
        formattedMessage = formattedMessage.replace(table, formattedTable);
    });

    // Divide a mensagem formatada se necessário
    return splitMessageForDiscord(formattedMessage);
}

/**
 * Função auxiliar para dividir mensagens longas
 */
function splitMessageForDiscord(message: string): string[] {
    const MAX_LENGTH = 2000;
    
    if (message.length <= MAX_LENGTH) {
        return [message];
    }
    
    const chunks: string[] = [];
    let currentPosition = 0;
    
    while (currentPosition < message.length) {
        if (currentPosition + MAX_LENGTH >= message.length) {
            chunks.push(message.slice(currentPosition));
            break;
        }
        
        // Encontra o último bloco de código completo dentro do limite
        const cutoff = currentPosition + MAX_LENGTH;
        let splitPosition = cutoff;
        
        // Procura por ```markdown ou ``` para não quebrar no meio de um bloco
        const codeBlockStart = message.lastIndexOf('```markdown', cutoff);
        const codeBlockEnd = message.lastIndexOf('```\n', cutoff);
        
        if (codeBlockStart > currentPosition && codeBlockEnd < currentPosition) {
            // Estamos no meio de um bloco de código, volta até o início
            splitPosition = codeBlockStart;
        } else {
            // Procura o último espaço antes do limite
            const lastSpace = message.lastIndexOf(' ', cutoff);
            if (lastSpace > currentPosition) {
                splitPosition = lastSpace;
            }
        }
        
        chunks.push(message.slice(currentPosition, splitPosition));
        currentPosition = splitPosition + 1;
    }
    
    return chunks;
}

async function enviarMensagemDiscord(mensagem: string, WEBHOOK_URL:string) {
    try {
        
        const messageParts = splitMessageForDiscord(mensagem);
        for (const part of messageParts) {
            const response = await axios.post(WEBHOOK_URL, {
                content: part
            });
        
        }
        
        return true;
        
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
                if (config.webhook && config.path){
                    const msg = await report.createSprintSummaryReport(config.path);
                    await enviarMensagemDiscord(msg, config.webhook);
                }
                
            }
        } catch (error) {
            console.error("Erro na execução:", error);
        }
    }

main();
