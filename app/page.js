import Hero from "@/components/Hero";
import ShowBloodLists from "./blood/page";
import { HomeHero } from "@/components/HomeHero";
import RealTimeNavigation from "@/components/RealTimeNavigation";
import AvailabilitySystem from "@/components/AvailabilitySystem";


export default function Home() {
  return (
    <main>
      {/* <Hero /> */}
      <HomeHero />
      <AvailabilitySystem />
      <RealTimeNavigation
        patientLocation={{
          lat: 23.7509,
          lng: 90.3935,
          name: "Dhanmondi General Hospital"
        }}
      />
      <ShowBloodLists />
    </main>
  );
}
