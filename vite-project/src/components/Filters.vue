<template>
  <h3>{{ title }}</h3>
  <small>Filter op:</small>
  <label v-for="layer in store.state.layers" :key="layer.id">
    <div class="filter-title">
      <span
        class="bullet"
        :style="{
          background: layer.paint['circle-color'],
          visibility: layer.visible ? 'visible' : 'hidden'
        }"
      /><span>{{ layer.id }}</span>
      <input type="checkbox" :value="layer.id" @change="store.toggleLayer(layer.id)" :checked="layer.visible" />
    </div>
    <span>{{ layer.visible ? layer.total : 0 }}</span>
  </label>
  <footer>
    <span class="total">{{ total }}</span>
  </footer>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useStore } from '../store';

  defineProps<{
    title: string;
  }>();

  const store = useStore();

  const total = computed(() => {
    // bereken de totale hoeveelheid vogels aan de hand van het totaal van elke layer (vogel)
    let totalPerLayer = 0;
    store.state.layers.map((layer) => {
      totalPerLayer += layer.visible ? layer.total : 0;
    });
    return totalPerLayer;
  });
</script>

<style lang="scss" scoped>
  .filter-title {
    display: flex;
    align-items: center;
  }
  label {
    display: flex;
    height: 2rem;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    margin: 0 -0.5rem;
    padding: 0 0.5rem;

    &:hover {
      background: $grey-light;
    }
  }
  input {
    display: none;
  }
  .bullet {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    margin-right: 1rem;
  }
  footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.25rem;

    .total {
      border-top: 1px solid $grey;
      width: 80px;
      text-align: right;
      padding-top: 0.25rem;
    }
  }
</style>
