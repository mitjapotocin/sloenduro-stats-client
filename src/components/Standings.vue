<template>
  <div>Working on it.</div>
</template>

<script>
import StatsService from "../StatsService";

export default {
  data() {
    return {
      results: {},
      events: []
    };
  },
  async created() {
    try {
      this.events = await StatsService.getPosts("/api/events/series/sloenduro");
    } catch (err) {
      this.error = err.message;
    }
    this.events.forEach(async event => {
      try {
        this.results[event.event] = await StatsService.getPosts(
          `/api/results/${event.event}`
        );
      } catch (err) {
        this.error = err.message;
      }
    });
  },
  methods: {
    calculatePoints(position) {
      if (typeof position == "string") {
        return 0;
      }
      if (position > 79) {
        return 1;
      }
      if (position > 51) {
        return 29 + 52 - position;
      }
      if (position > 20) {
        return 90 - 2 * (position - 21);
      }
      if (position > 10) {
        return 140 - 5 * (position - 11);
      }
      if (position > 4) {
        return 200 - 10 * (position - 5);
      }
      if (position == 4) {
        return 220;
      }
      if (position == 3) {
        return 250;
      }
      if (position == 2) {
        return 300;
      }
      if (position == 1) {
        return 400;
      }
    }
  },
  computed: {}
};
</script>


<style lang="scss" scoped>
</style>