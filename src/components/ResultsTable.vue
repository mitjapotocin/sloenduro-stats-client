<template>
  <div>
    <div
      v-for="(result) in results"
      v-bind:key="result._id"
      :class="{'selected': result.selected}"
      @click="toggleSelected(result)"
    >
      <a>{{result.PlacePoints}} {{result.Name}} {{result.Team}} {{result.Time}} Display: {{result.display}} Selected: {{result.selected}}{{result.Course}}</a>
    </div>
    <div @click="toggleSelected(test)">{{test}}</div>
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
  methods: {
    sort: function() {
      this.results.sort((a, b) => {
        if (typeof a.PlacePoints === "string") {
          return 1;
        }
        if (typeof b.PlacePoints === "string") {
          return -1;
        } else {
          a.PlacePoints > b.PlacePoints ? 1 : -1;
        }
      });
    },
    toggleSelected: function(result) {
      result.selected = !result.selected;
      this.sort();
    }
  },
  computed: {
    resultsSorted() {
      return this.results.sort((a, b) =>
        a.PlacePoints > b.PlacePoints ? 1 : -1
      );
    }
  }
};
</script>

<style>
.selected {
  background-color: rgba(135, 207, 235, 0.281);
}
</style>
