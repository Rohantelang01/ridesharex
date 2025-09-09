import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const filters = [
    { label: "Within 2 km", count: 3 },
    { label: "Driver + Vehicle", count: 2 },
    { label: "Vehicle Only", count: 1 },
    { label: "4.5+ Rating", count: 4 },
];

export default function Filters() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">🎯 Quick Filters</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {filters.map((filter, index) => (
                        <div key={index} className="flex justify-between items-center text-sm py-2 border-b last:border-b-0">
                            <span className="text-gray-700">{filter.label}</span>
                            <span className="font-medium text-gray-900">{filter.count} available</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
