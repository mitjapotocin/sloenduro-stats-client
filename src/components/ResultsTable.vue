<template>
  <div>
    <!-- <el-input placeholder="Type to search" v-model="search"></el-input> -->
    <el-input placeholder="Search by name" v-model="search" prefix-icon="el-icon-search"></el-input>
    <el-table
      ref="multipleTable"
      :data="results.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column v-if="isTotalCategory" property="PlacePoints" label="Pos." width="50"></el-table-column>
      <el-table-column v-if="!isTotalCategory" property="CategoryPosition" label="Pos." width="50"></el-table-column>
      <el-table-column property="Name" label="Name" width="250">
        <template slot-scope="scope">
          <router-link :to="{ name: 'rider', params: {name: scope.row.Name }}">
            <span style="color:#409EFF;">{{scope.row.Name}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column property="Nation" label="Nat." width="52"></el-table-column>
      <el-table-column property="Team" label="Team" width="250"></el-table-column>
      <el-table-column property="Category" label="Category" width="135">
        <template slot-scope="scope">
          <el-tag type="success">{{scope.row.Category.split("(", 1)[0]}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="Time" label="Time" width="120"></el-table-column>
      <el-table-column property="selected" label="Sel." width="50">
        <template slot-scope="scope">
          <i v-if="scope.row.selected" style="color:#409EFF; " class="el-icon-check"></i>
        </template>-->
      </el-table-column>
      <el-table-column label width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="toggleSelected(scope.row)">Add/Remove</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "ResultsTable",
  props: { results: Array, isTotalCategory: Boolean },
  data() {
    return {
      search: "",
      input: "",
      loading: true
    };
  },
  created() {},
  methods: {
    removeComaAtTheEnd(string) {
      if (string[length(string - 1)] === ",") {
        return string.pop();
      } else return string;
    },
    toggleSelected: async function(result) {
      result.selected = !result.selected;
      await this.$parent.updateSelectedList(result);
    }
  },
  computed: {
    // resultsSorted() {
    //   return this.results.sort((a, b) => {
    //     if (typeof a.PlacePoints === "string") {
    //       return 1;
    //     }
    //     if (typeof b.PlacePoints === "string") {
    //       return -1;
    //     } else {
    //       return a.PlacePoints > b.PlacePoints ? 1 : -1;
    //     }
    //   });
    // }
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
