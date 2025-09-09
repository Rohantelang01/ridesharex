import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function QuickLocation() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="relative">
                        <Input type="text" placeholder="Your current location" defaultValue="Connaught Place, New Delhi" className="pr-10" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">📍</span>
                    </div>
                    <div className="relative">
                        <Input type="text" placeholder="Where do you want to go?" className="pr-10" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">🎯</span>
                    </div>
                    <Button className="w-full md:w-auto">Find</Button>
                </div>
            </CardContent>
        </Card>
    );
}