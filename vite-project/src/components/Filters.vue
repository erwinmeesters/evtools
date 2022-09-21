<template>
  <h3>{{ title }}</h3>
  <small>Filter op:</small>
  <label v-for="layer in store.state.layers" :key="layer.id"
    ><span
      class="bullet"
      :style="{
        background: layer.paint['circle-color'],
        visibility: layer.visible ? 'visible' : 'hidden'
      }"
    /><span>{{ layer.id }}</span>
    <input
      type="checkbox"
      :value="layer.id"
      @change="store.toggleLayer(layer.id)"
      :checked="layer.visible"
    />
  </label>
</template>

<script lang="ts" setup>
  import { useStore } from '../store';

  const props = defineProps<{
    title: string;
  }>();

  const store = useStore();
</script>

<style lang="scss" scoped>
  label {
    display: flex;
    height: 2rem;
    align-items: center;
    cursor: pointer;
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
</style>
