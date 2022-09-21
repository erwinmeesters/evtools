import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { DataSet, MapLayer } from '../components/types';
import { useProgrammatic } from '@oruga-ui/oruga-next';

export const useStore = defineStore('store', () => {
  const initialState = {
    data: {} as DataSet,
    layers: [] as Array<MapLayer>,
    loading: true
  };

  const state = reactive({ ...initialState });

  const { oruga } = useProgrammatic();

  function resetStore() {
    Object.assign(state, initialState);
  }

  async function fetchData(url: string) {
    state.loading = true;
    let response = null;
    try {
      response = await axios.get(url);
      state.data = response.data;
    } catch (error: any) {
      showError(error);
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

  function showError(error: any) {
    const notif = oruga.notification.open({
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
