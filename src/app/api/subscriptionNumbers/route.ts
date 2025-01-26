import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        const start = Date.now();

        // Faz a requisição HTTP para obter o HTML da página
        const { data } = await axios.get('https://peticaopublica.com.br/pview.aspx?pi=BR146748');
        console.log(`Requisição realizada em ${Date.now() - start}ms`);

        // Carrega o HTML no Cheerio para fazer o parsing
        const $ = cheerio.load(data);

        // Encontra o texto da div com a classe '.npeople'
        const text = $('.npeople').text();

        if (text) {
            // Retorna o número de assinaturas após remover pontuações
            return NextResponse.json({
                status: 200,
                subscriptionNumbers: parseInt(text.replace(/[.,]/g, '')),
            });
        } else {
            return NextResponse.json({
                status: 404,
                message: "Número não encontrado",
            });
        }
    } catch (error) {
        console.error('Erro ao buscar número:', error);
        return NextResponse.json({ status: 400, error: 'Erro ao buscar número' }, { status: 500 });
    }
}