'use client';
import ConstructionStory from '@/components/construction-story';
import HomeSections from '@/components/home-sections';
import PageMotion from '@/components/page-motion';
export default function Home(){
 return <>
  <a className="skip-link" href="#continut">Sari la conținut</a>
  <main id="continut"><ConstructionStory/><HomeSections/><PageMotion/></main>
 </>;
}
