
import HeroSection from '@/components/heroSection/HeroSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// --- SVG Icons (No external library needed) ---
const ShieldCheckIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
  </svg>
);

const CurrencyDollarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11s-1.536.21-2.121.718c-1.171.879-1.171 2.303 0 3.182z" />
    </svg>
);

const ClockIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


// --- MOCK DATA ---
const drivers = [
  { name: "John D.", rating: 4.8, vehicle: "Toyota Camry", distance: "5 min away", avatar: "/placeholder-user.jpg" },
  { name: "Jane S.", rating: 4.9, vehicle: "Honda Accord", distance: "8 min away", avatar: "/placeholder-user.jpg" },
  { name: "Sam W.", rating: 4.7, vehicle: "Tesla Model 3", distance: "12 min away", avatar: "/placeholder-user.jpg" },
  { name: "Maria G.", rating: 4.9, vehicle: "SUV XL", distance: "15 min away", avatar: "/placeholder-user.jpg" },
];

const vehicles = [
  { type: "Car", owner: "Alice J.", available: true, img: "/car.png" },
  { type: "Bike", owner: "Bob W.", available: false, img: "/bike.png" },
  { type: "Truck", owner: "Charlie B.", available: true, img: "/truck.png" },
  { type: "Bus", owner: "Diana A.", available: true, img: "/bus.png" },
];

const passengers = [
  { name: "Emily D.", destination: "Airport", type: "Solo", avatar: "/placeholder-user.jpg" },
  { name: "Michael C.", destination: "Downtown", type: "Pool", avatar: "/placeholder-user.jpg" },
  { name: "Sarah M.", destination: "Midtown", type: "Solo", avatar: "/placeholder-user.jpg" },
  { name: "David L.", destination: "Crosstown", type: "Pool", avatar: "/placeholder-user.jpg" },
];

const trips = [
    { id: "TRIP001", route: "Downtown to Airport", status: "In Progress", user: "Emily D." },
    { id: "TRIP002", route: "Midtown to Suburbs", status: "Completed", user: "Michael C." },
    { id: "TRIP003", route: "Uptown to Crosstown", status: "Scheduled", user: "Sarah M." },
    { id: "TRIP004", route: "Suburb to Downtown", status: "Completed", user: "David L." },
];


export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <HeroSection />

      {/* Why Choose CarGo? Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase">Why CarGo</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              A Better Way to Ride
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              Experience the future of mobility with features designed for your safety, comfort, and convenience.
            </p>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex">
              <div className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center bg-indigo-500 text-white">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Safety First</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  With live tracking, driver verification, and 24/7 support, your safety is our priority.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center bg-indigo-500 text-white">
                 <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Affordable Rides</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Transparent pricing and a variety of ride options to fit your budget. No hidden fees.
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 h-12 w-12 rounded-md flex items-center justify-center bg-indigo-500 text-white">
                <ClockIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Earn on Your Terms</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Drive with CarGo and turn your car into an earning machine. Flexible hours, instant payouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section with Tabs */}
      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-gray-900 dark:text-white">Explore What's Happening</h2>
              <Tabs defaultValue="drivers" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                      <TabsTrigger value="drivers">Nearby Drivers</TabsTrigger>
                      <TabsTrigger value="passengers">Nearby Passengers</TabsTrigger>
                      <TabsTrigger value="vehicles">Nearby Vehicles</TabsTrigger>
                      <TabsTrigger value="trips">Active Trips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="drivers" className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {drivers.map((driver) => (
                        <Card key={driver.name} className="overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                           <CardHeader className="flex flex-row items-center gap-4 p-4">
                              <Avatar>
                                <AvatarImage src={driver.avatar} alt={driver.name} />
                                <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle>{driver.name}</CardTitle>
                                <CardDescription>{driver.vehicle}</CardDescription>
                              </div>
                           </CardHeader>
                           <CardContent className="p-4 pt-0">
                                <p className="text-sm text-gray-600 dark:text-gray-300">★ {driver.rating} | {driver.distance}</p>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="passengers" className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {passengers.map((p) => (
                        <Card key={p.name} className="overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                           <CardHeader className="flex flex-row items-center gap-4 p-4">
                              <Avatar>
                                <AvatarImage src={p.avatar} alt={p.name} />
                                <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle>{p.name}</CardTitle>
                                <CardDescription>Destination: {p.destination}</CardDescription>
                              </div>
                           </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm text-gray-600 dark:text-gray-300">Trip Type: {p.type}</p>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="vehicles" className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {vehicles.map((v) => (
                        <Card key={v.type} className="flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300">
                           <CardHeader>
                               <CardTitle>{v.type}</CardTitle>
                               <CardDescription>Owner: {v.owner}</CardDescription>
                           </CardHeader>
                           <CardContent>
                               <span className={`text-sm font-medium px-2 py-1 rounded-full ${v.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {v.available ? "Available" : "Unavailable"}
                               </span>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="trips" className="mt-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {trips.map((trip) => (
                        <Card key={trip.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                           <CardHeader>
                               <CardTitle className="text-base">{trip.route}</CardTitle>
                               <CardDescription>{trip.id} | {trip.user}</CardDescription>
                           </CardHeader>
                           <CardContent>
                               <span className={`text-sm font-medium px-2 py-1 rounded-full ${trip.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : trip.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {trip.status}
                               </span>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
              </Tabs>
          </div>
      </section>

       {/* Call to Action Section (Become a Driver) */}
       <section className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <div className="container mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to start earning?</span>
                    <span className="block">Join CarGo as a driver today.</span>
                </h2>
                <p className="mt-4 max-w-lg mx-auto text-lg text-indigo-100">
                    Enjoy flexible hours, competitive earnings, and be your own boss. It's easy to get started.
                </p>
                <div className="mt-8 flex justify-center">
                    <Button size="lg" className="bg-white text-indigo-600 font-semibold hover:bg-gray-100">
                        Sign Up to Drive
                    </Button>
                </div>
            </div>
        </section>
    </div>
  );
}
