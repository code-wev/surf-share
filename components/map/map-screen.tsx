"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

import {
	defaultFromDate,
	defaultToDate,
	demoSurfSpots,
	timeOptions,
	type SurfSpot,
	type TimeOptionValue,
} from "@/components/map/map-demo-data";

const SurfMapView = dynamic(() => import("@/components/map/surf-map-view"), {
	ssr: false,
	loading: () => (
		<div className="flex h-full w-full items-center justify-center bg-fill-weak text-sm text-text-weak">
			Loading map...
		</div>
	),
});

export default function MapScreen() {
	const [selectedState, setSelectedState] = useState("all");
	const [selectedRegion, setSelectedRegion] = useState("all");
	const [selectedFromDate, setSelectedFromDate] = useState(defaultFromDate);
	const [selectedToDate, setSelectedToDate] = useState(defaultToDate);
	const [selectedTime, setSelectedTime] = useState<TimeOptionValue>("all");
	const [activeSpotId, setActiveSpotId] = useState<string | null>(demoSurfSpots[0]?.id ?? null);

	const stateOptions = useMemo(() => {
		return ["all", ...Array.from(new Set(demoSurfSpots.map((spot) => spot.state)))];
	}, []);

	const regionOptions = useMemo(() => {
		const spots =
			selectedState === "all"
				? demoSurfSpots
				: demoSurfSpots.filter((spot) => spot.state === selectedState);

		return ["all", ...Array.from(new Set(spots.map((spot) => spot.region)))];
	}, [selectedState]);

	const filteredSpots = useMemo(() => {
		return demoSurfSpots.filter((spot) => {
			const matchesState = selectedState === "all" || spot.state === selectedState;
			const matchesRegion = selectedRegion === "all" || spot.region === selectedRegion;
			const matchesTime = selectedTime === "all" || spot.timeWindows.includes(selectedTime);
			const inDateRange = !(selectedFromDate > spot.availableTo || selectedToDate < spot.availableFrom);

			return matchesState && matchesRegion && matchesTime && inDateRange;
		});
	}, [selectedRegion, selectedState, selectedTime, selectedFromDate, selectedToDate]);

	const resolvedActiveSpotId = filteredSpots.some((spot) => spot.id === activeSpotId)
		? activeSpotId
		: filteredSpots[0]?.id ?? null;

	const activeSpot: SurfSpot | null = useMemo(() => {
		if (!filteredSpots.length) return null;
		return filteredSpots.find((spot) => spot.id === resolvedActiveSpotId) ?? filteredSpots[0];
	}, [filteredSpots, resolvedActiveSpotId]);

	return (
		<section className="absolute inset-0 left-0 right-0 mx-auto flex w-full max-w-470 flex-col px-4 py-4 font-sf-pro sm:px-6 lg:px-10 xl:px-12.5">
			<div className="shrink-0 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5 xl:grid-cols-[1.5fr_0.95fr_0.75fr]">
				<div className="space-y-3">
					<h2 className="text-xl font-medium text-text-strong sm:text-2xl">Location</h2>
					<div className="grid grid-cols-2 gap-2 sm:gap-3">
						<label className="space-y-1.5">
							<span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
								State
							</span>
							<select
								value={selectedState}
								onChange={(event) => {
									setSelectedState(event.target.value);
									setSelectedRegion("all");
								}}
								className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
							>
								{stateOptions.map((stateOption) => (
									<option key={stateOption} value={stateOption}>
										{stateOption === "all" ? "All States" : stateOption}
									</option>
								))}
							</select>
						</label>

						<label className="space-y-1.5">
							<span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
								Region
							</span>
							<select
								value={selectedRegion}
								onChange={(event) => setSelectedRegion(event.target.value)}
								className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
							>
								{regionOptions.map((regionOption) => (
									<option key={regionOption} value={regionOption}>
										{regionOption === "all" ? "All Regions" : regionOption}
									</option>
								))}
							</select>
						</label>
					</div>
				</div>

				<div className="space-y-3">
					<h2 className="text-xl font-medium text-text-strong sm:text-2xl">Date Range</h2>
					<div className="grid grid-cols-2 gap-2 sm:gap-3">
						<label className="space-y-1.5">
							<span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
								From
							</span>
							<input
								type="date"
								value={selectedFromDate}
								onChange={(event) => setSelectedFromDate(event.target.value)}
								className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
							/>
						</label>

						<label className="space-y-1.5">
							<span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
								To
							</span>
							<input
								type="date"
								value={selectedToDate}
								min={selectedFromDate}
								onChange={(event) => setSelectedToDate(event.target.value)}
								className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
							/>
						</label>
					</div>
				</div>

				<div className="space-y-3 lg:col-span-2 xl:col-span-1">
					<h2 className="text-xl font-medium text-text-strong sm:text-2xl">Time</h2>
					<label className="space-y-1.5">
						<span className="text-[10px] font-semibold tracking-[0.08em] text-text-weaker uppercase">
							Window
						</span>
						<select
							value={selectedTime}
							onChange={(event) => setSelectedTime(event.target.value as TimeOptionValue)}
							className="h-11 w-full rounded-md border border-line-weaker bg-surface-muted-100 px-3 text-sm text-text-strong outline-none focus:border-brand-default"
						>
							{timeOptions.map((timeOption) => (
								<option key={timeOption.value} value={timeOption.value}>
									{timeOption.label}
								</option>
							))}
						</select>
					</label>
				</div>
			</div>

			<div className="relative mt-4 flex-1 min-h-75 w-full overflow-hidden rounded-md border border-line-weaker bg-fill-weak">
				<SurfMapView
					spots={filteredSpots}
					activeSpotId={activeSpot?.id ?? null}
					onActiveSpotChange={setActiveSpotId}
				/>

				{!activeSpot ? (
					<div className="pointer-events-none absolute inset-0 z-600 flex items-center justify-center">
						<p className="rounded-md bg-surface-muted-100/95 px-4 py-2 text-sm font-medium text-text-weak shadow-sm">
							No map locations match the selected filters.
						</p>
					</div>
				) : null}
			</div>
		</section>
	);
}
