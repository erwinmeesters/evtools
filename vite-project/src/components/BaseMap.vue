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
      source: 'src'
    }
  );

  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  const data = computed(() => props.data);
  const layers = computed(() => props.layers);
  let map: any;

  watch(
    () => layers.value,
    (lyrs) => {
      lyrs.forEach((layer: MapLayer) => {
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
    mapboxgl.accessToken = token;

    map = new mapboxgl.Map(props.config);
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('load', () => {
      map.addSource(props.source, {
        type: 'geojson',
        data: data.value
      });

      for (const layer of layers.value) {
        map.addLayer(layer);
        map.setFilter(layer.id, ['==', ['get', props.filter], layer.id]);

        map.on('mouseenter', layer.id, (e: any) => {
          map.getCanvas().style.cursor = 'pointer';
          const coordinates = e.features[0].geometry.coordinates.slice();
          const lProps = e.features[0].properties as Properties;

          const description = `<div>
            <div><strong>${lProps.Vogel}</strong></div>
            <div>${lProps.Straatnaam} ${lProps.Huisnummer}</div>
            <div>${lProps.Verblijfplaats}</div>           
          </div>`;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

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
