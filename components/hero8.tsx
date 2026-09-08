import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Adapted from licensed shadcnblocks Hero 8. Its media slot contains live Three.js.
export function Hero8({media,controls}:{media:ReactNode;controls:ReactNode}){
 return <div className="hero8">
  <div className="hero8-container">
   <div className="hero8-copy">
    <div className="hero8-copy-stack">
     <h1>Din idee,<br className="mobile-break"/> <span>în realitate.</span></h1>
     <p>Construcții civile, industriale și reabilitare.<br/>Din 2004, de la prima linie la ultimul detaliu.</p>
     <div className="hero8-actions">
      <a className={cn(buttonVariants({size:'lg'}),'hero8-primary')} href="#contact">Să discutăm proiectul tău <ArrowUpRight size={17}/></a>
      <a className={cn(buttonVariants({size:'lg',variant:'ghost'}),'hero8-secondary')} href="#expertiza">Ce construim</a>
     </div>
    </div>
   </div>
   <div className="hero8-media">{media}</div>
   {controls}
  </div>
 </div>;
}
