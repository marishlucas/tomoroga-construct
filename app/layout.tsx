import type { Metadata } from 'next';
import { pageBootstrap } from '@/lib/page-bootstrap';
import './globals.css';
import './sections.css';
import './story.css';
import './navigation.css';
import './portfolio.css';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
export const metadata:Metadata={title:'Tomoroga Construct — Antrepriză generală',description:'Construcții civile, industriale și reabilitare. Tomoroga Construct, din 2004.',robots:{index:false,follow:false}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ro" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:pageBootstrap}}/><link rel="preload" href="/fonts/switzer-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><SiteHeader/>{children}<SiteFooter/></body></html>}
