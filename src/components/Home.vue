<template>
  <div>
    <div
      class="post"
      v-for="(event) in events"
      v-bind:item="event"
      v-bind:index="text"
      v-bind:key="event._id"
    >
      <a>
        <router-link
          :to="{ name: 'event', params: { event: event.event }}"
        >{{event.date}} {{event.eventName}} {{event.year}}</router-link>
      </a>
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

