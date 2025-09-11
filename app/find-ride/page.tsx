
import FindRideHeader from "@/components/find-ride/Header";
import QuickLocation from "@/components/find-ride/QuickLocation";
import Map from "@/components/common/Map";
import AvailableDrivers from "@/components/find-ride/AvailableDrivers";
import Booking from "@/components/find-ride/Booking";
import Filters from "@/components/find-ride/Filters";
import SelectedDriver from "@/components/find-ride/SelectedDriver";


export default function FindRidePage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <FindRideHeader />
            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <QuickLocation />
                        <Map />
                        <AvailableDrivers />
                    </div>
                    <div className="space-y-6">
                        <Booking />
                        <Filters />
                        <SelectedDriver />
                    </div>
                </div>
            </div>
        </div>
    );
}
