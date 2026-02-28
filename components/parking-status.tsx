import { MapPin, AlertCircle, CheckCircle2, Navigation } from "lucide-react";

export type ParkingStructure = {
    id: string;
    name: string;
    availableSpots: number;
    totalSpots: number;
    status: "green" | "yellow" | "red";
    location: {
        lat: number;
        lng: number;
    };
};

export function ParkingStatus({ parkingData }: { parkingData: ParkingStructure[] }) {
    if (!parkingData || parkingData.length === 0) {
        return (
            <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
                No parking data available at this time.
            </div>
        );
    }

    // Sort by availability, best first
    const sortedData = [...parkingData].sort((a, b) => {
        // Sort logic: green > yellow > red. If same status, higher availability first.
        const statusOrder = { green: 1, yellow: 2, red: 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return b.availableSpots - a.availableSpots;
    });

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm w-[min(100%,450px)]">
            <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">Downtown Santa Monica Parking</h3>
            </div>

            <div className="flex flex-col gap-3">
                {sortedData.map((structure) => {
                    const occupancy = Math.round(((structure.totalSpots - structure.availableSpots) / structure.totalSpots) * 100);

                    return (
                        <div key={structure.id} className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="font-medium text-sm text-foreground">{structure.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {structure.availableSpots} of {structure.totalSpots} spots available
                                    </p>
                                </div>
                                {structure.status === "green" && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                )}
                                {structure.status === "yellow" && (
                                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                                )}
                                {structure.status === "red" && (
                                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                                )}
                            </div>

                            {/* Progress Bar Container */}
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full ${structure.status === "green" ? "bg-emerald-500" :
                                            structure.status === "yellow" ? "bg-amber-500" : "bg-red-500" // Inverse logic for the bar width vs color
                                        }`}
                                    style={{ width: `${occupancy}%` }}
                                />
                            </div>

                            {/* Action row */}
                            <div className="flex justify-end pt-1">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${structure.location.lat},${structure.location.lng}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    <Navigation className="h-3 w-3" />
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
