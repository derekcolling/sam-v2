import { Waves, Thermometer, Droplets, Info } from "lucide-react";
import type { BeachLocation } from "@/lib/ai/tools/get-beach-safety";

export function BeachSafetyCard({ beachData }: { beachData: BeachLocation[] }) {
    if (!beachData || beachData.length === 0) {
        return (
            <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm">
                No beach safety data available at this time.
            </div>
        );
    }

    const getGradeColor = (grade: string) => {
        if (grade.startsWith("A")) return "bg-emerald-500 text-white border-emerald-600";
        if (grade.startsWith("B")) return "bg-blue-500 text-white border-blue-600";
        if (grade.startsWith("C")) return "bg-yellow-500 text-white border-yellow-600";
        if (grade.startsWith("D")) return "bg-orange-500 text-white border-orange-600";
        return "bg-red-500 text-white border-red-600";
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm w-[min(100%,450px)]">
            <div className="flex items-center gap-2 pb-2 border-b">
                <Waves className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">Santa Monica Beach Conditions</h3>
            </div>

            <div className="flex flex-col gap-4">
                {beachData.map((location) => (
                    <div key={location.id} className="flex flex-col gap-3 rounded-lg bg-muted/30 p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="font-semibold text-base text-foreground">{location.name}</h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold ${location.waterStatus === "Open" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" :
                                            location.waterStatus === "Warning" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
                                                "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                        }`}>
                                        {location.waterStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">Water Quality</span>
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg shadow-sm font-bold text-xl border ${getGradeColor(location.waterQualityGrade)}`}>
                                    {location.waterQualityGrade}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="flex flex-col gap-1 rounded bg-background p-2 border shadow-sm">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <Thermometer className="h-3.5 w-3.5 text-orange-500" />
                                    Water Temp
                                </div>
                                <div className="text-sm font-semibold">{location.waterTempFahrenheit}°F</div>
                            </div>

                            <div className="flex flex-col gap-1 rounded bg-background p-2 border shadow-sm">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <Waves className="h-3.5 w-3.5 text-blue-500" />
                                    Surf
                                </div>
                                <div className="text-sm font-semibold">{location.surfHeightFeet[0]}-{location.surfHeightFeet[1]} ft</div>
                                <div className="text-[10px] text-muted-foreground">{location.surfConditions}</div>
                            </div>

                            <div className="flex flex-col gap-1 rounded bg-background p-2 border shadow-sm col-span-2">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                    <Droplets className="h-3.5 w-3.5 text-cyan-500" />
                                    Next Tide
                                </div>
                                <div className="text-sm font-semibold text-foreground">
                                    {location.tide.type} at {location.tide.time}
                                </div>
                                <div className="text-xs text-muted-foreground text-balance mt-1">
                                    {location.description}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-start gap-2 rounded bg-muted/50 p-3 pt-2">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-snug">
                    Mock data shown. In a real app, this would use the Heal the Bay API for water quality and Surfline for wave data.
                </p>
            </div>
        </div>
    );
}
