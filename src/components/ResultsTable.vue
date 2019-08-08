<template>
  <div>
    <div
      v-for="(result) in resultsSorted"
      v-bind:key="result._id"
      class="result"
      :class="{'selected': result.selected}"
      @click="toggleSelected(result)"
    >
      <a>{{result.PlacePoints}} {{result.Name}} {{result.Team}} {{result.Time}} Display: {{result.display}} Selected: {{result.selected}}{{result.Course}}</a>
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
  methods: {
    sort: function() {
      this.results.sort((a, b) => {
        if (typeof a.PlacePoints === "string") {
          return 1;
        }
        if (typeof b.PlacePoints === "string") {
          return -1;
        } else {
          a.PlacePoints < b.PlacePoints ? 1 : -1;
        }
      });
    },
    toggleSelected: function(result) {
      result.selected = !result.selected;
      this.$parent.updateSelectedList();
    }
  },
  computed: {
    resultsSorted() {
      return this.results.sort((a, b) => {
        if (typeof a.PlacePoints === "string") {
          return 1;
        }
        if (typeof b.PlacePoints === "string") {
          return -1;
        } else {
          a.PlacePoints > b.PlacePoints ? 1 : -1;
        }
      });
    }
  }
};
</script>

<style>
.result {
  margin: 3px;
}
.result:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.044);
}
.selected {
  color: blueviolet;
}
</style>
