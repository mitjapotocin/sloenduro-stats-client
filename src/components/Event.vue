<template>
  <div>
    <h1>{{ $route.params.event}}</h1>

    <el-switch v-model="displayChart" active-text="Display chart"></el-switch>
    <selected-tags v-bind:selected="selectedResults"></selected-tags>
    <div v-if="displayChart">
      <vue-apex-charts height="350px" type="scatter" :options="options2" :series="series2"></vue-apex-charts>
    </div>

    <!-- <selected-tags v-bind:selected="selectedResults"></selected-tags>
    <vue-apex-charts type="scatter" :options="options2" :series="series2"></vue-apex-charts>-->

    <div>
      <el-radio-group v-model="selectedCourse" size="medium">
        <el-radio-button
          v-for="(course, index) in courses"
          :key="index"
          v-bind:value="course"
          v-bind:label="course"
          border
        >{{course}}</el-radio-button>
      </el-radio-group>
    </div>

    <div class="container">
      <loading v-if="loading"></loading>
      <results-table class="results-table" v-bind:results="filteredResults"></results-table>
    </div>
  </div>
</template>

<script>
import SelectedTags from "./SelectedTags";
import StatsService from "../StatsService";
import TimeConversion from "../TimeConversion";
import ResultsTable from "./ResultsTable";
import Loading from "./Loading";
import VueApexCharts from "vue-apexcharts";
import { Radio } from "element-ui";

export default {
  components: {
    SelectedTags,
    VueApexCharts,
    ResultsTable,
    Loading,
    Radio
  },
  name: "Event",
  data() {
    return {
      displayChart: false,
      radio1: "1",
      loading: true,
      event: this.$route.params.event,
      results: [],
      //! handle when results are selected
      selectedResults: [],
      filteredResults: [],
      selectedCourse: "",
      error: "",
      text: "",
      resultsApi: `/api/results/${this.$route.params.event}`
    };
  },
  async created() {
    try {
      this.results = await StatsService.getPosts(this.resultsApi);
    } catch (err) {
      this.error = err.message;
    }

    this.results.forEach(result => {
      this.$set(result, "selected", false);
    });
    this.selectedCourse = this.courses[0];
    this.filterList();
    this.updateSelectedList();
    this.loading = false;
  },

  methods: {
    clearSelectedList: function() {
      this.selectedResults = [];
    },
    updateSelectedList: function(result) {
      if (result != undefined) {
        result.selected == true
          ? this.selectedResults.push(result)
          : this.selectedResults.splice(
              this.selectedResults.indexOf(result),
              1
            );
      } else {
        this.selectedResults = [];
        this.filteredResults.forEach(result => {
          if (result.selected == true) {
            this.selectedResults.push(result);
          }
        });
      }
    },
    filterList: function() {
      this.filteredResults = [];
      this.results.forEach(result => {
        if (result.Course == this.selectedCourse) {
          // if (result.PlacePoints == 1) {
          //   result.selected = true;
          // }
          this.filteredResults.push(result);
        }
      });
    }
  },
  computed: {
    options2() {
      return {
        chart: {
          background: "#fff",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            }
          },
          height: 350,
          type: "scatter",
          zoom: {
            enabled: true,
            type: "xy"
          }
        },

        xaxis: {
          title: {
            text: "Time",
            rotate: 90
          },
          tickAmount: 10,
          labels: {
            formatter: function(value) {
              return `${value.toFixed(3)} s`;
            }
          }
        },
        yaxis: {
          labels: {
            show: false,
            formatter: function(value) {
              return `${value.toFixed(0)}.`;
            }
          },
          title: {
            text: "Position",
            rotate: 90
          },
          //! this can cause issues if chart reation is moved into a component
          //? tickAmound is calculated from this component data
          tickAmount: this.selectedResults.length
        },
        legend: {
          showForSingleSeries: true,
          onItemClick: {
            toggleDataSeries: false
          }
        }
      };
    },
    series2() {
      var series = [];
      if (this.selectedResults.length > 0) {
        this.selectedResults.forEach(element => {
          if (element.Time !== "") {
            series.push({
              name: `${element.Name}`,
              data: [
                [
                  TimeConversion.timeToSeconds(element.Time),
                  element.PlacePoints
                ]
              ]
            });
          }
        });
      }
      return series;
    },

    //computes number of diferent courses (short/long)
    courses() {
      return [...new Set(this.results.map(result => result.Course))].sort();
    },

    // computes number of stages
    noOfStages() {
      let count = 0;
      Object.keys(this.results[0]).forEach(key => {
        if (key.slice(0, 11) == "ControlName") count++;
      });
      return count;
    }
  },
  watch: {
    selectedCourse: {
      handler: function() {
        this.filterList();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  text-align: left;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

.loadingcontainer {
  display: inline;
  position: absolute;
  text-align: center;
}
.loading {
  text-align: center;
}
.spinner {
  display: inline-block;
}

.post {
  background: #a2d9fdc0;
  margin: 3px;
  text-align: left;
}
.post:hover {
  background: #77c9ff;
}
.results-table {
  display: inline-block;
}
button {
  font-weight: 400;
  font-size: 16px;
  background-color: rgba(245, 222, 179, 0);

  border: none;
}
textarea:focus,
button:focus {
  outline: none;
}
.container {
  text-align: center;
}
.canvas-container {
  padding-left: 40px;
  padding-right: 40px;
}

.selected {
  background-color: rgba(135, 207, 235, 0.281);
}
</style>



