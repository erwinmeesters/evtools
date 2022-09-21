import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { DataSet, Feature, MapLayer } from '../components/types';

export const useStore = defineStore('store', () => {
  const initialState = {
    data: {} as DataSet,
    layers: [] as Array<MapLayer>,
    loading: true
  };

  const state = reactive({ ...initialState });

  function resetStore() {
    Object.assign(state, initialState);
  }

  async function fetchData(url: string) {
    state.loading = true;
    try {
      const response = await axios.get(url);
      state.data = response.data;
    } catch (error: any) {
      console.log('error', error);
    } finally {
      state.loading = false;
    }
  }

  function setLayers(layers: Array<MapLayer>) {
    state.layers = layers;
  }

  function clearLayers() {
    state.layers = [];
  }

  function toggleLayer(layerId: string) {
    state.layers = state.layers.map((layer: MapLayer) => {
      if (layer.id === layerId) layer.visible = !layer.visible;
      return layer;
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
