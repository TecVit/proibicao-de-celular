import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const start = Date.now();
        const browserPromise = puppeteer.launch({
            headless: true,
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: await chromium.executablePath(),
        });
        console.log(`Chromium inicializado em ${Date.now() - start}ms`);

        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout excedido')), 6000)
        );
        
        const browser = await Promise.race([browserPromise, timeoutPromise]);
        const page = await browser.newPage();

        // Bloquear imagens, CSS, fontes e JavaScript
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            const url = request.url();
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
                request.abort();
            } else {
                request.continue();
            }
        });

        // Desabilitar execução de JavaScript
        await page.setJavaScriptEnabled(false);

        const url = "https://peticaopublica.com.br/pview.aspx?pi=BR146748";
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const text = await page.$eval('.npeople', element => element.textContent);
        
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