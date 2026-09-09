import type { Metadata } from 'next';
import './globals.css';
import './sections.css';
export const metadata:Metadata={title:'Tomoroga Construct — Antrepriză generală',description:'Construcții civile, industriale și reabilitare. Tomoroga Construct, din 2004.',robots:{index:false,follow:false}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ro"><head><link rel="preload" href="/fonts/switzer-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}</body></html>}
