<template>
  <div v-if="!store.state.loading">
    <base-map
      :source="source"
      :config="config"
      :data="store.state.data"
      :layers="store.state.layers"
      :filter="filter"
    />
    <div class="filters-wrapper">
      <filters title="Vogelbroedplaatsen in Amsterdam" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import BaseMap from './components/BaseMap.vue';
  import { Colors, Feature, MapConfig, MapLayer } from './components/types';
  import { useStore } from './store';
  import Filters from './components/Filters.vue';

  const config = ref<MapConfig>({
    container: 'mapContainer',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [4.92, 52.35],
    zoom: 11
  });

  const url = ref('https://maps.amsterdam.nl/open_geodata/geojson_lnglat.php?KAARTLAAG=VOGELS&THEMA=vogels');

  const source = 'mapSource';

  const filter = 'Vogel';

  const store = useStore();

  function buildLayers() {
    store.clearLayers();
    const layerSet: Array<MapLayer> = [];
    const uniques: Map<string, Array<Feature>> = new Map();

    store.state.data.features.map((feature: Feature) => {
      const fProp = feature.properties[filter];
      if (/overig/i.test(fProp)) return;
      uniques.has(fProp) ? uniques.get(fProp)?.push(feature) : uniques.set(fProp, [feature]);
    });

    uniques.forEach((item, key) => {
      layerSet.push({
        id: key,
        type: 'circle',
        source: source,
        paint: {
          'circle-radius': 3,
          'circle-color': Colors[key as keyof typeof Colors] || Colors['Undefined'],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        },
        visible: true,
        total: item.length
      });
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
    background: rgba($white, 0.95);
    display: flex;
    flex-flow: column nowrap;
    padding: 1rem 2rem;
    box-shadow: rgba($black, 0.5) 0px 5px 15px;
    overflow-y: auto;
    max-height: calc(100vh - 2rem);
  }
</style>
