<template>
  <div id="app">
    <header2 />
    <router-view></router-view>
  </div>
</template>

<script>
import Header2 from "./components/Header2.vue";

export default {
  name: "app",
  components: {
    Header2
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}

img {
  max-width: 30%;
}
</style>
