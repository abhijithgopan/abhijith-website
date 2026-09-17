# Chart components

The visual system is intentionally small and reusable:

- `BarChart.astro` — ranked or categorical comparisons.
- `LineChart.astro` — time series.
- `AreaChart.astro` — time series where the filled area adds meaning.
- `ScatterPlot.astro` — relationships between two measures.
- `SmallMultiples.astro` — repeated compact comparisons.
- `DataTable.astro` — searchable/sortable tabular data.
- `ChartFrame.astro` — consistent framing.
- `ChartNote.astro` — restrained notes, sources and caveats.

Keep article data outside the component whenever practical. The component should render the visual; the article should own the data and interpretation.
