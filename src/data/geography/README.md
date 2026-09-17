# Geography data

The map components use GeoJSON boundaries at runtime so the main site bundle does not contain a large national district file.

The default India/state GeoJSON endpoints are provided by the public `udit-001/india-maps-data` repository through jsDelivr. The repository describes its maps as a collection of public geographical data and provides India-wide and state-level GeoJSON, including district boundaries.

Before publishing an analysis, check that the boundary vintage matches the geography used by the dataset. Administrative boundaries and district names can change over time.

For a publication that must remain fully self-contained/offline, replace the `url` values in `IndiaMap.astro` and `StateMap.astro` with local GeoJSON files under this directory.
