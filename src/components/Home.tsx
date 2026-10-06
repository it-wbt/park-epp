import IndustryExplorer from './IndustryExplorer';
import HomeApplications from './HomeApplications';
import HomeExpertise from './HomeExpertise';
import HomeContact from './HomeContact';
import HomeIntro from './HomeIntro';
import HomeResources from './HomeResources';
import ManufacturingHero from './ManufacturingHero';

export default function Home() {
  return <div className="modern-home">
    <ManufacturingHero/>
    <HomeIntro/>
    <IndustryExplorer/>
    <HomeApplications/>
    <HomeExpertise/>
    <HomeResources/>
    <HomeContact/>
  </div>;
}
