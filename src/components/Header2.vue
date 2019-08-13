<template>
  <div class="header">
    <div class="container">
      <tr>
        <th>
          <a class="logo">Sloenduro Results</a>
        </th>

        <th>
          <router-link :to="{ name: 'home', params: {}}">
            <a>Home</a>
          </router-link>
        </th>
        <th>
          <router-link :to="{ name: 'standings', params: {}}">
            <a>Standings</a>
          </router-link>
        </th>
      </tr>
    </div>
    <!-- <span>&nbsp</span> -->
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

<style scoped>
.header {
  background-color: black;
  color: white;
}
.container {
  margin: 20px;
}
tr {
}
.logo {
  margin: 20px 80px 20px 20px;
}
a {
  color: white;
  text-decoration: none;
}
</style>


