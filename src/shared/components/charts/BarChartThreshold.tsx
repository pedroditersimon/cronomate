import { maxBy } from "lodash";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "src/assets/Icons";
import Button from "src/shared/components/interactable/Button";
import { cn } from "src/shared/utils/cn";

export interface BarChartDataItem {
    label: string;
    value: number;
    valueLabelFormatter?: (value: number) => string;
}

export interface BarChartThreshold {
    label: string;
    value: number;
    segmentColorClass?: string;
    thresholdBorderColorClass?: string;
}

interface BarChartSegment {
    size: number;
    bgColorClass: string;
}

const defaultThreshold: BarChartThreshold = {
    label: "Tope", value: 11,
    segmentColorClass: "bg-slate-200", thresholdBorderColorClass: "border-slate-200"
};

const defaultData: BarChartDataItem[] = [
    { label: "Lunes", value: 9.4 },
    { label: "05-07", value: 7.8 },
    { label: "06-07", value: 4 },
    { label: "07-07", value: 15 },
    { label: "08-07", value: 1.5 },
    { label: "09-07", value: 8 },
    { label: "10-07", value: 8.7 },
];

interface Props {
    data: BarChartDataItem[];
    thresholds?: BarChartThreshold[];
    className?: string;
    maxSegments?: number;
    page?: number;
    onPageChange?: (page: number) => void;
}

export default function BarChartThreshold({ data, thresholds, className, maxSegments, page, onPageChange, }: Props) {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const [internalPage, setInternalPage] = useState(0);
    const pageCount = maxSegments ? Math.ceil(data.length / maxSegments) : 1;
    const currentPage = Math.min(page ?? internalPage, Math.max(pageCount - 1, 0));
    const visibleData = maxSegments
        ? data.slice(currentPage * maxSegments, (currentPage + 1) * maxSegments)
        : data;

    useEffect(() => {
        if (page === undefined) setInternalPage(0);
    }, [data, maxSegments, page]);

    const changePage = (nextPage: number) => {
        if (page === undefined) setInternalPage(nextPage);
        onPageChange?.(nextPage);
    };

    const maxValue = maxBy(data, "value")?.value ?? 0;
    thresholds = thresholds ?? [{ ...defaultThreshold, value: maxValue }];

    const maxThreshold = maxBy(thresholds, "value");

    // Threshold más alto: define el 100% de altura del gráfico.

    const maxThresholdValue = maxThreshold?.value ?? 0;
    const maxY = maxThresholdValue > maxValue ? maxThresholdValue : maxValue;

    // Thresholds ordenados para poder partir cada barra en segmentos.
    const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

    // Convierte un valor absoluto a porcentaje de altura.
    const getHeightPercent = (value: number) => {
        return (value / maxY) * 100;
    };

    // Divide una barra en bloques según los thresholds.
    const getSegments = (value: number): BarChartSegment[] => {
        const segments: BarChartSegment[] = [];
        let from = 0;

        sortedThresholds.forEach(threshold => {
            const to = Math.min(value, threshold.value);

            if (to > from) {
                segments.push({
                    size: to - from,
                    bgColorClass: threshold.segmentColorClass ?? defaultThreshold.segmentColorClass!,
                });
            }

            from = threshold.value;
        });

        if (value > from) {
            const lastThreshold = sortedThresholds[sortedThresholds.length - 1];

            segments.push({
                size: value - from,
                bgColorClass: lastThreshold?.segmentColorClass ?? defaultThreshold.segmentColorClass!,
            });
        }

        return segments;
    };

    return (
        <div className={cn("w-full", className)}>
            {pageCount > 1 && (
                <div className="mb-2 flex justify-end gap-1">
                    <Button
                        icon={<ChevronLeftIcon className="size-5" />}
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="p-1"
                    />
                    <Button
                        icon={<ChevronRightIcon className="size-5" />}
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === pageCount - 1}
                        className="p-1"
                    />
                </div>
            )}

            <div className="h-44">
            {/* Área principal del gráfico */}
            <div className="relative h-36 flex flex-row gap-2">
                {/* Barras */}
                {visibleData.map((item, itemIdx) => (
                    <div key={item.label} className="relative flex-1 flex flex-col justify-end">
                        <div
                            className={cn("absolute z-10 inset-0 flex flex-col justify-end",
                                { "opacity-20": hoveredItem !== itemIdx && hoveredItem !== null }
                            )}
                        >
                            {[...getSegments(item.value)].reverse().map((segment, segmentIdx, segments) => {
                                const isTop = segmentIdx === 0;
                                const isBottom = segmentIdx === segments.length - 1;

                                return (
                                    <div
                                        key={segmentIdx}
                                        className={cn(
                                            segment.bgColorClass,
                                            isTop && "rounded-t",
                                            isBottom && "rounded-b"
                                        )}
                                        style={{ height: `${getHeightPercent(segment.size)}%` }}
                                    />
                                );
                            })}
                        </div>
                        <div
                            onMouseEnter={() => setHoveredItem(itemIdx)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="flex flex-col absolute z-20 inset-y-0 -inset-x-1 bg-gradient-to-b from-slate-600/40 to-slate-600/10 opacity-0 hover:opacity-100"
                        >
                            <span className="text-center text-sm mt-1 mx-2 font-semibold bg-black/50 rounded">{item.valueLabelFormatter ? item.valueLabelFormatter(item.value) : item.value}</span>
                        </div>
                    </div>
                ))}

                {/* Líneas de referencia entre thresholds */}
                {sortedThresholds.map(threshold =>
                    threshold.value < maxY && (
                        <div
                            key={threshold.value}
                            className={cn(
                                "absolute left-0 right-0 z-0 border-b-2 border-dashed",
                                threshold.thresholdBorderColorClass ??
                                defaultThreshold.thresholdBorderColorClass,
                                hoveredItem === null ? "opacity-10" : "opacity-40"
                            )}
                            style={{ bottom: `${getHeightPercent(threshold.value)}%` }}
                        />
                    ))}
            </div>

            {/* Labels inferiores */}
            <div className="flex flex-row gap-2">
                {visibleData.map((item, itemIdx) => (
                    <div
                        key={item.label}
                        className={cn(
                            "flex-1 text-xs text-center",
                            { "opacity-20": hoveredItem !== itemIdx && hoveredItem !== null }
                        )}>
                        {item.label}
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
}
