'use client';

import ProjectEnquiry from '@/components/project-enquiry';
// Retained for a later iteration:
// import { ProjectGallery, Process, DetailExplorer } from '@/components/archived-home-sections';

export default function HomeSections() {
  return (
    <div className="home-sections">
      {/* <ProjectGallery /> */}
      {/* <Process /> */}
      {/* <DetailExplorer /> */}
      <ProjectEnquiry />
    </div>
  );
}
