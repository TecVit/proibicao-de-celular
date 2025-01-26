import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        const start = Date.now();

        const url = `${process.env.NEXT_PUBLIC_API_URL}/https://peticaopublica.com.br/pview.aspx?pi=BR146748`;
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Origin": process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
                "X-Requested-With": "XMLHttpRequest"
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