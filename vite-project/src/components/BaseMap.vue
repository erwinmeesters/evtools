<template>
  <section class="basemap-wrapper">
    <div :id="config.container" class="basemap"></div>
  </section>
</template>

<script lang="ts" setup>
  import mapboxgl from 'mapbox-gl';
  import { computed, onMounted, watch } from 'vue';
  import { DataSet, MapConfig, MapLayer, Properties } from './types';

  const props = withDefaults(
    defineProps<{
      source: string;
      config: MapConfig;
      data: DataSet;
      layers: Array<MapLayer>;
      filter: string;
    }>(),
    {
      source: 'src' // indien er geen source wordt meegegeven is dit de default
    }
  );

  // mapbox api key, stored in .env
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const data = computed(() => props.data);
  const layers = computed(() => props.layers);
  let map: any; // init map (mooier is om dit een juiste type mee te geven ipv any, maar de mapbox types zijn lastig te achterhalen / te implementeren. Er zijn third party libraries voor zover ik kon vinden maar voor nu swah)

  watch(
    () => layers.value,
    // watch wijzigingen in de layers (bij filteren op vogel wordt de visibility van de betreffende layer getoggeld)
    (lyrs) => {
      lyrs.forEach((layer: MapLayer) => {
        // loop over layers, check of de layer bestaat en set de visibility property op basis van layer.visible
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(layer.id, 'visibility', layer.visible ? 'visible' : 'none');
        }
      });
    },
    {
      deep: true
    }
  );

  function initMap() {
    // init map en popups (on hover bij een vogel)
    mapboxgl.accessToken = token;

    map = new mapboxgl.Map(props.config);
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('load', () => {
      // voeg een datasource toe aan de map
      map.addSource(props.source, {
        type: 'geojson',
        data: data.value
      });

      // loop over alle layers en voeg elke layer toe aan de map
      for (const layer of layers.value) {
        map.addLayer(layer);
        map.setFilter(layer.id, ['==', ['get', props.filter], layer.id]);

        // mousehandler voor hover events. toon een popup met een korte description per vogel
        map.on('mouseenter', layer.id, (e: any) => {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.features[0].geometry.coordinates.slice();
          const lProps = e.features[0].properties as Properties;

          // popup description
          const description = `<div>
            <div><strong>${lProps.Vogel}</strong></div>
            <div>${lProps.Straatnaam} ${lProps.Huisnummer}</div>
            <div>${lProps.Verblijfplaats}</div>           
          </div>`;

          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          // Populate the popup and set its coordinates
          // based on the feature found.
          popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        // mouseleave event, remove de popup
        map.on('mouseleave', layer.id, () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });
      }
    });
  }

  onMounted(() => {
    initMap();
  });
</script>

<style lang="scss" scoped>
  .basemap-wrapper {
    height: 100vh;
    width: 100vw;
  }
  .basemap {
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
  }

  ::v-deep(.mapboxgl-popup) {
    max-width: 400px;
  }
</style>
