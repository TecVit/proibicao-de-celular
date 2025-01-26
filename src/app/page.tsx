import Image from 'next/image';
import Logo from '../assets/images/logo.png';
import './style.css';
import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';
import { Suspense } from 'react';
import Counter from './components/Counter';
import { FaTiktok } from 'react-icons/fa';

async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/subscriptionNumbers`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
    next: {
      revalidate: 10
    }
  });
  
  if (!res.ok) {
    return {
      status: 404,
      message: "Número não encontrado"
    };
  }

  const data = await res.json();
  return data.subscriptionNumbers;
}

// Função de React Server Component
export default async function Home() {
  const counter = await getData() || 841124;

  return (
    <main className="container-landing">
      <header className='container-navbar'>
        {/* Navbar */}
        <div className="content-navbar">
          <Image quality={100} src={Logo} alt="Logo" width={100} height={100} />
          <div className="links">
            <Link href="#inicio">Início</Link>
            <Link href="#sobre">Sobre o Projeto</Link>
            <Link href="https://www.instagram.com/olhaprofessor">Instragam</Link>
          </div>
          <div className="btns">
            <Link className='btn-one' href="https://peticaopublica.com.br/pview.aspx?pi=BR146748">Assinar Agora</Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <section id='inicio' className="content-landing">
        <div className="text">
          <h1>Já somos 
            <strong>
              <Suspense fallback={<>Carregando..</>}>
                <Counter initialCount={counter} />
              </Suspense>
            </strong> 
            <br /> Assine e Junte-se a nós!
          </h1>
          <p>Seja a mudança na educação: apoie o uso responsável da tecnologia nas escolas e ajude a transformar o aprendizado!</p>
          <div className="btns">
            <Link className='btn-one' href="https://peticaopublica.com.br/pview.aspx?pi=BR146748">Assinar Agora</Link>
            <Link className='btn-two' href="/#sobre">Saiba Mais</Link>
          </div>
        </div>
      </section>

      {/* Sobre o Projeto */}
      <section id='sobre' className="about">
        <div className="text">
          <div className="boll">
            <p>Sobre o Projeto</p>
          </div>
          <h1>Substituição da <br/> Lei de Proibição de Celulares</h1>
          <p>O projeto propõe substituir a lei que proíbe o uso de celulares nas escolas, incentivando um uso responsável e integrado da tecnologia no aprendizado.</p>
          <div className="cards">
            <div className="card">
              <h1>Revogação da Lei de Proibição de Celulares nas Escolas</h1>
              <p>O projeto visa substituir a atual legislação, permitindo o uso controlado de celulares nas escolas, incentivando um ambiente de aprendizado mais integrado à tecnologia.</p>
            </div>
            <div className="card">
              <h1>Tecnologia como Aliada no Aprendizado Escolar</h1>
              <p>Propomos uma nova regulamentação que valoriza a tecnologia como ferramenta pedagógica, promovendo o uso consciente e educacional dos dispositivos móveis nas escolas.</p>
            </div>
            <div className="card">
              <h1>Uma Nova Perspectiva para o Uso de Celulares nas Escolas</h1>
              <p>Ao invés de proibir, o projeto busca criar diretrizes pedagógicas para o uso de celulares, respeitando o impacto da tecnologia no desenvolvimento dos alunos.</p>
            </div>
            <div className="card">
              <h1>Educação Digital: O Caminho para a Inclusão Tecnológica nas Escolas</h1>
              <p>Com o avanço da tecnologia, o projeto propõe a inclusão do uso de celulares nas escolas com uma abordagem educacional, abordando os desafios do uso excessivo das redes sociais.</p>
            </div>
            <div className="card">
              <h1>Garantindo o Direito à Educação Digital</h1>
              <p>A substituição da lei atual busca equilibrar a proibição com a criação de um ambiente digital seguro e educativo, com foco na formação integral do aluno.</p>
            </div>
            <div className="card">
              <h1>Por uma Educação que Acompanha o Século XXI</h1>
              <p>O projeto visa modernizar a legislação, criando uma regulamentação pedagógica que permita o uso de celulares de maneira construtiva no processo de ensino-aprendizagem.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credits */}
      <footer className="credits">
        <div className="top">
          <div className="info">
            <h1>Já somos 
              <strong>
                <Suspense fallback={<>Carregando..</>}>
                  <Counter initialCount={counter} />
                </Suspense>
              </strong> 
              <br /> Assine e Junte-se a nós!
            </h1>
            <p>Seja a mudança na educação: apoie o uso responsável da tecnologia nas escolas</p>
            <div className="icons">
              <Link href="https://www.tiktok.com/@olhaprofessor">
                <FaTiktok className='icon' />
              </Link>
              <Link href="https://www.youtube.com/olhaprofessor">
                <Youtube className='icon' />
              </Link>
              <Link href="https://www.instagram.com/olhaprofessor">
                <Instagram className='icon' />
              </Link>
            </div>
          </div>
          <div className="links">
            <li>
              <h1>Links</h1>
              <Link href="/#inicio">Início</Link>
              <Link href="/#sobre">Sobre o Projeto</Link>
              <Link href="/#creditos">Créditos</Link>
            </li>
            <li>
              <h1>Redes Sociais</h1>
              <Link href="https://www.tiktok.com/@olhaprofessor">TikTok</Link>
              <Link href="https://www.instagram.com/olhaprofessor">Instagram</Link>
              <Link href="https://www.youtube.com/olhaprofessor">Youtube</Link>
            </li>
          </div>
        </div>
        <div className="bottom">
          <p>&copy; Todos os Direitos Reservados</p>
          <p>Developed by <Link href="https://instagram.com/tecvit_">TecVit</Link></p>
        </div>
      </footer>
    </main>
  );
}