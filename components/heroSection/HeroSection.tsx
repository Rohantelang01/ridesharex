
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Map from "./Map";

interface HeroSectionProps {
  badge?: string;
  heading: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
}

const HeroSection = ({
  badge = "✨ Your Mobility Solution",
  heading = "Ride, Rent, or Drive with RideShareX",
  description = "Book rides, rent vehicles, or hire drivers instantly.",
}: HeroSectionProps) => {
  return (
    <section className="py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1">
            {badge && (
              <Badge variant="outline" className="mb-6">
                {badge}
                <ArrowUpRight className="ml-2 size-4" />
              </Badge>
            )}
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {heading}
            </h1>
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <Button variant="default" size="default">
              Book a Ride
            </Button>
          </div>
          <Map />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;