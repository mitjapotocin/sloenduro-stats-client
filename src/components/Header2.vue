<template>
  <div class="header">
    <div class="container">
      <tr>
        <th class="logo">
          <a>Sloenduro Results</a>
        </th>

        <th>
          <router-link :to="{ name: 'home', params: {}}">
            <a>Home</a>
          </router-link>
        </th>

        <!-- <th>
          <router-link :to="{ name: 'standings', params: {}}">
            <a>Standings</a>
          </router-link>
        </th>-->
      </tr>
    </div>
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
  background-color: rgba(64, 160, 255, 0.479);
  color: white;
}
th {
  padding: 20px 20px 20px 40px;
}

.logo {
  padding: 20px;
  background-color: #409eff;
  margin: 20px 80px 20px 20px;
}
a {
  color: white;
  text-decoration: none;
}
</style>


