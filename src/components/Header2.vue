<template>
  <div>
    <h2>
      Sloenduro Results
      <router-link :to="{ name: 'home', params: {}}">
        <a>Home</a>
      </router-link>
      <span>&nbsp</span>
      <router-link :to="{ name: 'standings', params: {}}">
        <a>Standings</a>
      </router-link>
    </h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      event: "Ajdovscina"
    };
  }
};
</script>

