<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="resultsSorted"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- <router-link :to="{ name: 'rider', params: {name:"Mitja"}}"> -->
      <!-- </router-link> -->

      <el-table-column property="PlacePoints" label="Pos." width="50"></el-table-column>
      <el-table-column property="Name" label="Name" width="250">
        <template slot-scope="scope">
          <router-link :to="{ name: 'rider', params: {name: scope.row.Name }}">
            <span style="color:#409EFF;">{{scope.row.Name}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column property="Nation" label="Nat." width="50"></el-table-column>
      <el-table-column property="Team" label="Team" width="250"></el-table-column>
      <el-table-column property="Category" label="Category" width="125"></el-table-column>
      <el-table-column property="Time" label="Time" width="120"></el-table-column>
      <el-table-column property="selected" label="Selected" width="50">
        <template slot-scope="scope">
          <i v-if="scope.row.selected" style="color:#409EFF;" class="el-icon-check"></i>
        </template>
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
  props: { results: Array },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleEdit: function(row) {
      console.log(row);
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
          return a.PlacePoints > b.PlacePoints ? 1 : -1;
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
