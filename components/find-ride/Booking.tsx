import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Booking() {
    return (
        <Card>
            <CardContent className="p-4">
                <Tabs defaultValue="instant">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="instant">Instant</TabsTrigger>
                        <TabsTrigger value="advance">Advance</TabsTrigger>
                        <TabsTrigger value="trips">Find Trip</TabsTrigger>
                    </TabsList>
                    <TabsContent value="instant" className="mt-4 space-y-3">
                        <Button className="w-full text-base">Book Selected Driver</Button>
                        <Button variant="outline" className="w-full">Fill Detailed Form</Button>
                    </TabsContent>
                     <TabsContent value="advance" className="mt-4 space-y-3">
                        <Button className="w-full text-base">Schedule Booking</Button>
                        <Button variant="outline" className="w-full">Fill Detailed Form</Button>
                    </TabsContent>
                     <TabsContent value="trips" className="mt-4 space-y-3">
                        <Button className="w-full text-base">Join Selected Trip</Button>
                        <Button variant="outline" className="w-full">Fill Detailed Form</Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
