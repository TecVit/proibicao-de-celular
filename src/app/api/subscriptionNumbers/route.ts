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
        console.log(`Chromium inicializado em ${Date.now() - start}ms`)

        // No Plano Gratuito do NextJS a API só tem 10 segundos para te dar uma resposta :)
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout excedido')), 4000)
        );

        const browser = await Promise.race([browserPromise, timeoutPromise]);

        const page = await browser.newPage();

        const url = "https://peticaopublica.com.br/pview.aspx?pi=BR146748";
        await page.goto(url, { waitUntil: 'networkidle0' });
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
            })
        }
    } catch (error) {
        console.error('Erro ao buscar número:', error);
        return NextResponse.json({ status: 400, error: 'Erro ao buscar número' }, { status: 500 });
    }
}