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

  //mapbox config
  const config = ref<MapConfig>({
    container: 'mapContainer',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [4.92, 52.35],
    zoom: 11
  });

  // data url Amsterdam API
  const url = ref('https://maps.amsterdam.nl/open_geodata/geojson_lnglat.php?KAARTLAAG=VOGELS&THEMA=vogels');

  // identifier layer source
  const source = 'mapSource';

  // data prop waar op gefilterd wordt
  const filter = 'Vogel';

  // reference naar de Pinia store
  const store = useStore();

  function buildLayers() {
    // voordat de layerdata geset wordt in de store eerst zorgen dat de store leeg is
    store.clearLayers();

    // nieuwe layerset init
    const layerSet: Array<MapLayer> = [];

    // filter de dataset op unieke vogelnaam en set deze als keys in een Map, met als values de bijbehorende features
    const uniques: Map<string, Array<Feature>> = new Map();

    store.state.data.features.map((feature: Feature) => {
      const fProp = feature.properties[filter];
      // filter de vogelnamen "overig" uit de dataset
      if (/overig/i.test(fProp)) return;
      // zoek de vogelnaam op in de Map; bestaat deze, voeg dan de feature toe aan de vogel; zo niet maak de vogel aan in de Map
      uniques.has(fProp) ? uniques.get(fProp)?.push(feature) : uniques.set(fProp, [feature]);
    });

    // loop over de Map heen en push voor elke key (vogel) een layer van het type MapLayer toe aan de layerSet array
    uniques.forEach((value, key) => {
      layerSet.push({
        id: key,
        type: 'circle',
        source: source,
        paint: {
          'circle-radius': 3,
          'circle-color': Colors[key as keyof typeof Colors] || Colors['Undefined'], // set de bijbehorende kleur
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        },
        visible: true, // set de layer initieel zichtbaar
        total: value.length // set de totale hoeveelheid vogels als prop op de layer
      });
    });

    // store de layers set in de store
    store.setLayers(layerSet);
  }

  onMounted(async () => {
    await store.fetchData(url.value); // haal eerst de data op onMounted
    buildLayers(); // bouw daarna de layers
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
