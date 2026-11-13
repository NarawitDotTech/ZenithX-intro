import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { DriveTeam } from "@/components/sections/DriveTeam";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Log } from "@/components/sections/Log";
import { Nav } from "@/components/sections/Nav";
import { Process } from "@/components/sections/Process";
import { Robot } from "@/components/sections/Robot";
import { Team } from "@/components/sections/Team";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Process />
        <Robot />
        <Team />
        <Log />
        <DriveTeam />
      </main>
      <Footer />
    </>
  );
}
