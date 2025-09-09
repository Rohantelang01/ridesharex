import { Card, CardContent } from "@/components/ui/card";

export default function Map() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-blue-100 opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-gray-600">
                            <h3 className="text-xl font-semibold">Live Map View</h3>
                            <p>Nearby drivers and vehicles shown in real-time</p>
                        </div>
                    </div>
                    {/* Driver Markers */}
                    <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-purple-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>
                    <div className="absolute top-1/2 left-2/3 w-8 h-8 bg-purple-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>
                    <div className="absolute top-2/3 left-1/4 w-8 h-8 bg-purple-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>
                    <div className="absolute top-1/3 left-3/4 w-8 h-8 bg-purple-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>
                    <div className="absolute top-3/4 left-1/2 w-8 h-8 bg-purple-600 border-4 border-white rounded-full shadow-lg animate-pulse"></div>
                </div>
            </CardContent>
        </Card>
    );
}
