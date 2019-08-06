<template>
  <div>
    <div
      class="results"
      v-bind:item="results"
      v-for="(result) in resultsSorted"
      v-bind:key="result._id"
      v-bind:class="{'selected': result.selected}"
    >
      <a
        @click="toggleSelected(result);"
      >{{result.PlacePoints}} {{result.Name}} {{result.Team}} {{result.Time}} Display: {{result.display}} Selected: {{result.selected}}{{result.Course}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResultsTable",
  props: { results: Array },
  data() {
    return {};
  },
  created() {},
  methods: {},
  computed: {
    resultsSorted() {
      return this.results.sort((a, b) =>
        parseInt(a.PlacePoints) > parseInt(b.PlacePoints) ? 1 : -1
      );
    }
  }
};
</script>
