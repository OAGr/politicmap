import foo from './counties.json'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import _ from 'lodash'

export function initalizeMapbox(onHover){
  mapboxgl.accessToken = 'pk.eyJ1Ijoib3p6aWVnb29lbiIsImEiOiJjaXdta2x6ZGMwMDd5MnlxaXdrenl1cnFvIn0.D1040J3_cusTXEa_sQHEfA'
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [-98, 38.88],
    minZoom: 2,
    zoom: 4
  })
  map.boxZoom.disable();

  const overlay = document.getElementById('map-overlay');

  map.on('load', function() {
    map.addSource('counties', {
      "type": "vector",
      "url": "mapbox://mapbox.82pkq93d"
    });
    map.addLayer({
      "id": "counties",
      "type": "fill",
      "source": "counties",
      "source-layer": "original",
      "paint": {
      "fill-outline-color": "rgba(0,0,0,0.2)",
      "fill-color": "rgba(0,0,0,0.05)"
      }
    }, 'place-city-sm'); // Place polygon under these labels.

      map.addLayer({
        "id": "counties-highlighted",
        "type": "fill",
        "source": "counties",
        "source-layer": "original",
        "paint": {
        "fill-outline-color": "#222",
        "fill-color": "#444",
        "fill-opacity": 0.75
      },
      "filter": ["in", "COUNTY", ""]
      }, 'place-city-sm'); // Place polygon under these labels.

      map.addLayer({
        "id": "counties-large",
        "type": "fill",
        "source": "counties",
        "source-layer": "original",
        "paint": {
          "fill-outline-color": "#484896",
          "fill-color": "#457DBB",
          "fill-opacity": 0.8
        },
        "filter": [">=", "median-income", 40000],
        "filter": ["<=", "median-income", 50000],
      }, 'place-city-sm'); // Place polygon under these labels.

      map.addLayer({
        "id": "counties-population",
        "type": "fill",
        "source": "counties",
        "source-layer": "original",
        "paint": {
          "fill-outline-color": "#484896",
          "fill-color": "#CE74A6",
          "fill-opacity": 0.4
        },
      "filter": [">=", "population", 80000]
      }, 'place-city-sm'); // Place polygon under these labels.

      function selectFeature(feature){
        map.setFilter('counties-highlighted', ['in', 'FIPS', feature.properties.FIPS]);
      }
      const debouncedSelectFeature = _.throttle(selectFeature, 70)

      function mouseMove(e){
        var features = map.queryRenderedFeatures(e.point, {
            layers: ['counties']
        });

        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';

        // Remove things if no feature was found.
        if (!features.length) {
            map.setFilter('counties-highlighted', ['in', 'COUNTY', '']);
            overlay.style.display = 'none';
            return;
        }

        // Single out the first found feature on mouseove.
        var feature = features[0];

        // Query the counties layer visible in the map. Use the filter
        // param to only collect results that share the same county name.
        var relatedFeatures = map.querySourceFeatures('counties', {
            sourceLayer: 'original',
            filter: ['in', 'COUNTY', feature.properties.COUNTY]
        });

        onHover(feature);
        // Add features that share the same county name to the highlighted layer.
        debouncedSelectFeature(feature)
      }


      map.on('mousemove', mouseMove)
  })
}
