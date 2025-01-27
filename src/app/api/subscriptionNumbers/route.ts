import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import * as cheerio from 'cheerio';
import { NextResponse, type NextRequest } from 'next/server';
import { HTTPRequest } from 'puppeteer-core';

export async function GET(request: NextRequest) {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const waitTime = parseInt(urlParams.get('waitTime') || "0") || 0;
    
    try {
        const start = Date.now();
        const browserPromise = puppeteer.launch({
            headless: true,
            args: [
                ...chromium.args, 
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--enable-features=NetworkService',
            ],
            executablePath: await chromium.executablePath(),
        });
        console.log(`Chromium inicializado em ${Date.now() - start}ms`);

        const browser = await browserPromise;
        const page = await browser.newPage();

        // Bloquear imagens, CSS, fontes e JavaScript e adicionar cabeçalhos para as requisições
        await page.setRequestInterception(true);
        page.on('request', (req: HTTPRequest) => {
            const url = req.url();
            const headers = {
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "pt-PT,pt;q=0.8,en;q=0.5,en-US;q=0.3",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "application/x-www-form-urlencoded",
                "Host": "vercel.app",
                "Origin": process.env.NEXT_PUBLIC_URL || "",
                "Pragma": "no-cache",
                "Priority": "u=0",
                "Referer": process.env.NEXT_PUBLIC_URL || "",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "TE": "trailers",
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
            };

            if (
                url.endsWith('.png') ||
                url.endsWith('.jpg') ||
                url.endsWith('.jpeg') ||
                url.endsWith('.gif') ||
                url.endsWith('.css') ||
                url.endsWith('.woff') ||
                url.endsWith('.woff2') ||
                url.endsWith('.ttf') ||
                url.endsWith('.js') ||
                url.endsWith('.svg') ||
                url.endsWith('.mp4') ||
                url.endsWith('.webm') ||
                url.includes('font')
            ) {
                req.abort();
            } else {
                req.continue({ headers });
            }
        });

        // Definindo o cookie necessário para a página
        const cookies = [
            {
              name: 'cf_clearance', 
              value: 'za.9oCLmsK4uYcPZt.ZslE7dLYGYOEXGQKgBi_0ZEko-1737946336-1.2.1.1-17JeI4JqcIf5aLJDJDCpKqU4E2Y.z0NfdrsqGA5gZDHKAD.Iq.vL8VP5GLWZ09orSHlrt3mDNHGGztCNqX80ssr0ODVRNZtSqQLBNn3KGBIg2Okz92i0Noh1zI4e3GFdN2weovd3LtI2WIBAOaG2ZTKscqyJh6N4qBbca0Uku8bNGIz4O9bNkkZncV6DVLuQ3oslfKPUa3sdNF9mwkq.nc3wkTUzFTO8r0dHQG06j9nD9IqE3KgPu1sFQVbG1O2yG3SaFTfmcrOPgbOYZgfcNf4BVfjATEhfFfxvI5Zd2Uc', 
              domain: '.peticaopublica.com.br'
            }
        ];
        await page.setCookie(...cookies);

        // Acessando a página
        const url = "https://peticaopublica.com.br/pview.aspx?pi=BR146748";
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));

        // Obter o HTML da página
        const html = await page.content();
        console.log(html);

        // Usar Cheerio para analisar o HTML
        const $ = cheerio.load(html);
        const text = $('.npeople').text();

        await browser.close();
        
        if (text) {
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