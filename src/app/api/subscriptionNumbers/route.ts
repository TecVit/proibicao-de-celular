import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        const start = Date.now();

        const url = 'https://corsproxy.io/?url=https://peticaopublica.com.br/pview.aspx?pi=BR146748';
          
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "pt-BR,pt;q=0.9",
            },
        });

        if (!response.ok) {
            console.log(response);
            throw new Error('Erro ao carregar a página');
        }

        const html = await response.text();
        console.log(`Requisição realizada em ${Date.now() - start}ms`);

        const $ = cheerio.load(html);

        const text = $('.npeople').text().trim();

        if (text) {
            return NextResponse.json({
                status: 200,
                subscriptionNumbers: parseInt(text.replace(/[.,]/g, ''), 10),
            });
        } else {
            return NextResponse.json({
                status: 404,
                message: 'Número não encontrado',
            });
        }
    } catch (error) {
        console.error('Erro ao buscar número:', error);
        return NextResponse.json({ status: 400, error: 'Erro ao buscar número' }, { status: 500 });
    }
}