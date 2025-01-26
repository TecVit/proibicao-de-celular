import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        const start = Date.now();

        const url = 'https://corsproxy.io/?url=https://peticaopublica.com.br/pview.aspx?pi=BR146748';

        const cookies = [
            "__eoi=ID=9524ecf218d599bd:T=1737912528:RT=1737927045:S=AA-Afja6VfU9s1AI6-4rzazazTja",
            "__gads=ID=d1e5267913bde6e3:T=1737912528:RT=1737927045:S=ALNI_Ma3WEFOVBiONlEiwiKjJBMLXxer_w",
            "__gpi=UID=00000fee6616d343:T=1737912528:RT=1737927045:S=ALNI_MZ2sq5e6wdROXpzSleA8-PDl9oiyg",
            "_ga=GA1.1.130143431.1737912528",
            "_ga_4QFTX7SRFF=GS1.1.1737926633.2.1.1737927045.0.0.0",
            "_gat_gtag_UA_4269839_47=1",
            "_gid=GA1.3.1858230998.1737912528",
            `cf_clearance=QlkAK5jq._DBqBpllUUYt84EctJeeh1YFcS_axEokdE-1737927045-1.2.1.1-TkPi5JHqel8VfviFBe6sCDa8mJ.jMbuNDMgusKeelubEmOqP401eCApsTKYmtgLyGL5G1LI3dYQSVZggytXehyJZ78GrYSXF6tc90cMUiTu2cq1exCIlAWUg2TCtOnaLIHhz9YhE5vn88fNt23oty_JLDN_nSSlEiTyeWUpOwWr2NsdW3ikG1Ds6zJR_JtECSX0qL7TY07o2PqWtaGXgzXvDgjuMotwEj0pe9nlt8lHyJJ7aYEccISH1P1oa6MQTjSiFvTZr3xbTobeXAX0iHY79H47YuAo0299L6oX.OR0`,
            `FCNEC=[[\"AKsRol8Qo3yugDS7jWGNRRBGBivviRVyUXX4H7A8rUQNdKrCyF7uJeiUCe-zPYLAol5zmjI5tnKnqFe0SYf98zVyffVkhoUzue3t7jf5dTh9sdTpo3kWGKHmRKYK9uPdMAzc2d1g5IMlhBNViv0PnZrxZKcvqWVdEA==\"]]`
        ];
          
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://peticaopublica.com.br/",
                "Accept-Language": "pt-BR,pt;q=0.9",
                "Cookies": cookies.join("; "),
            },
        });

        if (!response.ok) {
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