import type { Metadata } from "next";
import localFont from 'next/font/local';
import Favicon from '../assets/images/logo.jpg';
import "./globals.css";

const customFont = localFont({
  src: [
    {
      path: '../assets/fonts/CustomFont-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/CustomFont-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
});

export const metadata: Metadata = {
  title: "Substituição da lei de proibição de celular",
  description: "Responsável: @olhaprofessor - Website Developed by TecVit",
  icons: Favicon.src,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${customFont.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
