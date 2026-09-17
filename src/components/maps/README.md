# Maps

Reusable geography components:

- `IndiaMap.astro` — India/state-level choropleths.
- `StateMap.astro` — district-level map for a named state/UT.
- `DistrictMap.astro` — alias for state district maps when used semantically as a district-level visual.
- `GeoMap.astro` — low-level generic GeoJSON renderer.

Example:

```astro
---
import { IndiaMap, StateMap } from "../components/maps";

const stateData = [
  { label: "Kerala", value: 72.4 },
  { label: "Tamil Nadu", value: 68.1 },
];

const districtData = [
  { label: "Ernakulam", value: 50.5 },
  { label: "Kottayam", value: 10.7 },
];
---

<IndiaMap
  title="Indicator by state"
  data={stateData}
  suffix="%"
  caption="Source: your dataset."
/>

<StateMap
  state="Kerala"
  title="Indicator by district"
  data={districtData}
  suffix="%"
/>
```

Data joins are performed against common geography-name properties. If a dataset uses another property or a different spelling, use `GeoMap.astro` and provide `propertyKeys`, or standardise the data labels before rendering.
