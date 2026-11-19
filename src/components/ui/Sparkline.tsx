// src/components/ui/Sparkline.tsx
// A tiny area chart: no axes, no grid, no interaction. Colour follows the
// period's direction using the theme's up/down tokens.
import { useEffect, useRef } from 'react';
import { AreaSeries, ColorType, createChart, IChartApi, UTCTimestamp } from 'lightweight-charts';

function cssRgb(name: string, alpha = 1) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
  return v ? `rgba(${v.split(/\s+/).join(',')},${alpha})` : `rgba(128,128,128,${alpha})`;
}

export default function Sparkline({
  points,
  height = 48,
  className = '',
  label,
}: {
  points: { t: number; v: number }[];
  height?: number;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || points.length < 2) return;
    const up = points[points.length - 1].v >= points[0].v;
    const tone = up ? 'up' : 'down';
    const chart = createChart(el, {
      height,
      width: el.clientWidth,
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: 'transparent', attributionLogo: false },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: { visible: false },
      leftPriceScale: { visible: false },
      timeScale: { visible: false, borderVisible: false },
      crosshair: { vertLine: { visible: false, labelVisible: false }, horzLine: { visible: false, labelVisible: false } },
      handleScroll: false,
      handleScale: false,
    });
    const series = chart.addSeries(AreaSeries, {
      lineColor: cssRgb(tone),
      topColor: cssRgb(tone, 0.22),
      bottomColor: cssRgb(tone, 0),
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });
    const seen = new Set<number>();
    series.setData(
      points
        .filter((p) => !seen.has(p.t) && seen.add(p.t))
        .map((p) => ({ time: p.t as UTCTimestamp, value: p.v })),
    );
    chart.timeScale().fitContent();
    chartRef.current = chart;
    const ro = new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth }));
    ro.observe(el);
    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [points, height]);

  return <div ref={ref} role="img" aria-label={label} className={className} style={{ height }} />;
}
