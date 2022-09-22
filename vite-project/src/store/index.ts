import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { DataSet, MapLayer } from '../components/types';
import { useProgrammatic } from '@oruga-ui/oruga-next';

export const useStore = defineStore('store', () => {
  // define de initial state
  const initialState = {
    data: {} as DataSet,
    layers: [] as Array<MapLayer>,
    loading: true
  };

  // maak de state reactive
  const state = reactive({ ...initialState });

  // oruga is een lightweight bootstrap framework: https://oruga.io/
  // In dit geval gebruikt om een notification popup te tonen indien het laden van de data fout gaat
  const { oruga } = useProgrammatic();

  function resetStore() {
    Object.assign(state, initialState);
  }

  // fetch de data van de Amsterdam API
  async function fetchData(url: string) {
    state.loading = true;
    let response = null;
    try {
      response = await axios.get(url);
      // set de data in de store
      state.data = response.data;
    } catch (error: any) {
      // indien error invoke showError
      showError(error);
    } finally {
      // set loading op false
      state.loading = false;
    }
  }

  // set de layers in de store
  function setLayers(layers: Array<MapLayer>) {
    state.layers = layers;
  }

  // clear de layers
  function clearLayers() {
    state.layers = [];
  }

  // toggle visibility van een layer op basis van layerId
  function toggleLayer(layerId: string) {
    state.layers = state.layers.map((layer: MapLayer) => {
      if (layer.id === layerId) layer.visible = !layer.visible;
      return layer;
    });
  }

  // show een notification met een error
  function showError(error: any) {
    oruga.notification.open({
      message: `Er is iets misgegaan, ${error}`,
      variant: 'danger',
      position: 'top',
      closable: true,
      indefinite: true
    });
  }

  return {
    state,
    resetStore,
    fetchData,
    setLayers,
    clearLayers,
    toggleLayer
  };
});
