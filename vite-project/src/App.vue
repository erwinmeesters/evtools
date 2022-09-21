<template>
  <div v-if="!store.state.loading">
    <base-map
      :config="config"
      :data="store.state.data"
      :layers="store.state.layers"
    />
    <div class="filters-wrapper">
      <filters title="Vogelbroedplaatsen in Amsterdam" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import BaseMap from './components/BaseMap.vue';
  import { Colors, Feature, MapConfig } from './components/types';
  import { useStore } from './store';
  import Filters from './components/Filters.vue';

  const config = ref<MapConfig>({
    container: 'mapContainer',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [4.89707, 52.377956],
    zoom: 11
  });

  const url = ref<string>(
    'https://maps.amsterdam.nl/open_geodata/geojson_lnglat.php?KAARTLAAG=VOGELS&THEMA=vogels'
  );

  const store = useStore();

  function buildLayers() {
    store.clearLayers();
    const uniques: Set<string> = new Set();
    store.state.data.features.map(
      (feature: Feature) =>
        !/overig/i.test(feature.properties.Vogel) &&
        uniques.add(feature.properties.Vogel)
    );
    const layerSet = Array.from(uniques).map((item) => {
      return {
        id: item,
        type: 'circle',
        source: 'src',
        paint: {
          'circle-radius': 3,
          'circle-color': Colors[item as keyof typeof Colors],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        },
        visible: true
      };
    });
    store.setLayers(layerSet);
  }

  onMounted(async () => {
    await store.fetchData(url.value);
    buildLayers();
  });
</script>

<style lang="scss" scoped>
  .filters-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.9);
    // width: 300px;
    display: flex;
    flex-flow: column wrap;
    padding: 1rem 2rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
</style>
