<template>
  <div>
    <div
      class="container"
      v-for="(event) in events"
      v-bind:item="event"
      v-bind:index="text"
      v-bind:key="event._id"
    >
      <router-link :to="{ name: 'event', params: { event: event.event }}">
        <el-card class="box-card" shadow="hover">
          <p>{{event.eventName}}</p>
          <p>{{event.date}}</p>
          <p>{{event.year}}</p>
        </el-card>
      </router-link>
    </div>
  </div>
</template>

<script>
import StatsService from "../StatsService";

export default {
  name: "HomeComponent",
  data() {
    return {
      selectedPosts: [],
      events: [],
      error: "",
      text: "",
      eventsApi: "api/events"
    };
  },
  async created() {
    try {
      this.events = await StatsService.getPosts(this.eventsApi);
    } catch (err) {
      this.error = err.message;
    }
  },
  methods: {}
};
</script>

<style scoped>
.container {
  margin: 20px;
  text-align: center;
}

.box-card {
  width: 360px;
  display: inline-block;
}
</style>
