import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SelectedDriver() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Selected: Rajesh Sharma</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
                <p><strong>Service:</strong> Driver + Vehicle</p>
                <p><strong>Vehicle:</strong> White Maruti Swift</p>
                <p><strong>Distance:</strong> 2.3 km (3 min away)</p>
                <p><strong>Rate:</strong> ₹80/hr + ₹12/km</p>
                <p><strong>Rating:</strong> ⭐ 4.8 (124 rides)</p>
            </CardContent>
        </Card>
    );
}
