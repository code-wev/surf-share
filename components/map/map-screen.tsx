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

function toHumanDate(value: string) {
	const date = new Date(value);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	});
}

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
		<section className="mx-auto w-full max-w-470 px-4 py-8 font-sf-pro sm:px-6 sm:py-10 lg:px-10 xl:px-12.5 xl:py-12.5">
			<h1 className="text-2xl font-semibold tracking-tight text-brand-default sm:text-3xl lg:text-4xl">
				Find Your Wave
			</h1>
			<p className="mt-2 text-sm text-text-weak sm:text-base">
				Discover high-quality surf photography from world-class breaks.
			</p>

			<div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 lg:grid-cols-2 lg:gap-5 xl:mt-12 xl:grid-cols-[1.5fr_0.95fr_0.75fr]">
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

			<div className="relative mt-6 h-[52vh] min-h-90 w-full overflow-hidden border border-line-weaker bg-fill-weak sm:h-[56vh] sm:min-h-105 md:h-[60vh] md:min-h-130 lg:h-[64vh] lg:min-h-145 xl:h-[72vh] xl:min-h-160 2xl:h-[78vh] 2xl:min-h-190">
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

			<p className="mt-3 text-xs leading-relaxed text-text-weaker sm:text-sm">
				Showing {filteredSpots.length} locations | {toHumanDate(selectedFromDate)} to{" "}
				{toHumanDate(selectedToDate)} | {selectedTime === "all" ? "All Times" : selectedTime}
			</p>
		</section>
	);
}
