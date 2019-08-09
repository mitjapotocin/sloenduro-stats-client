<template>
  <div>
    <h1>{{ $route.params.name}}</h1>
    <div
      v-for="result in results"
      v-bind:key="result.event"
    >Event: {{result.event}} Position: {{result.PlacePoints}}</div>
  </div>
</template>

<script>
import StatsService from "../StatsService";

export default {
  data() {
    return {
      results: [],
      resultsApi: `/api/results/riders/${this.$route.params.name}`
    };
  },

  async created() {
    try {
      this.results = await StatsService.getPosts(this.resultsApi);
    } catch (err) {
      this.error = err.message;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>