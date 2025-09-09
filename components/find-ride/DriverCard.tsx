import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DriverCard({ driver }) {
    return (
        <Card className={`cursor-pointer transition-all ${driver.selected ? 'border-purple-600 bg-purple-50' : ''}`}>
            <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-3">
                    <Avatar className="w-12 h-12 text-lg">
                        <AvatarImage src={driver.profileImage || '/placeholder-user.jpg'} alt={driver.name} />
                        <AvatarFallback>{driver.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{driver.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                ⭐ {driver.rating}
                            </div>
                            <span>{driver.distance} km away</span>
                            <span>{typeof driver.duration === 'number' ? `${driver.duration} min` : driver.duration}</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        {driver.vehicle}
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">{driver.rate}</div>
                        <div className="text-xs text-gray-500">{driver.rateUnit}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
