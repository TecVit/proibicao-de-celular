import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        const start = Date.now();

        // const url = `${process.env.NEXT_PUBLIC_API_URL}/https://peticaopublica.com.br/pview.aspx?pi=BR146748`;
        const url = "https://corsproxy.io/?url=https://peticaopublica.com.br/pview.aspx?pi=BR146748";
        
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "pt-PT,pt;q=0.8,en;q=0.5,en-US;q=0.3",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Length": "0",
                "Content-Type": "application/x-www-form-urlencoded",
                "Host": "corsproxy.io",
                "Origin": process.env.NEXT_PUBLIC_URL || "",
                "Pragma": "no-cache",
                "Priority": "u=0",
                "Referer": process.env.NEXT_PUBLIC_URL || "",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
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