<template>
  <div>
    <div class="top-container">
      <!-- TODO: change event name -->
      <h1>{{ $route.params.event}}</h1>

      <!-- TODO: make a nice transition  -->
      <div class="selected-results-container">
        <p
          style="padding: 5.091px; margin: 0px"
          v-if="selectedResults.length == 0 "
        >Select riders from results table.</p>
        <selected-tags v-else v-bind:selected="selectedResults"></selected-tags>
      </div>
      <el-collapse @change="handleChangeStages">
        <el-collapse-item title="Position by stages" name="1">
          <!-- v-if display Chart -->
          <div v-if="displayChartStages">
            <vue-apex-charts
              type="line"
              height="450px"
              :options="optionsStages"
              :series="seriesStages"
            ></vue-apex-charts>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-collapse @change="handleChange">
        <el-collapse-item title="Scatter" name="1">
          <div v-if="displayChart">
            <vue-apex-charts height="350px" type="scatter" :options="options2" :series="series2"></vue-apex-charts>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="bottom-container">
      <div v-if="!loading" class="table">
        <div>
          <div class="filter-container">
            <div>
              <el-radio-group v-model="selectedCourse" size="small">
                <el-radio-button
                  v-for="(course, index) in Object.keys(resultsByCategory).sort()"
                  :key="index"
                  v-bind:value="course"
                  v-bind:label="course"
                  border
                >{{course}}</el-radio-button>
              </el-radio-group>
            </div>
            <div>
              <el-radio-group v-model="selectedCategory" size="small">
                <el-radio-button
                  v-for="(category, index) in Object.keys(this.resultsByCategory[selectedCourse]).sort()"
                  :key="index"
                  v-bind:value="category"
                  v-bind:label="category"
                  border
                >{{category}}</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>

        <results-table
          class="results-table"
          v-bind:results="resultsByCategory[selectedCourse][selectedCategory]"
          v-bind:isTotalCategory="selectedCategory == 'Total'"
        ></results-table>
      </div>
    </div>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import SelectedTags from "./SelectedTags";
import StatsService from "../StatsService";
import TimeConversion from "../TimeConversion";
import ResultsTable from "./ResultsTable";
import Loading from "./Loading";
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    SelectedTags,
    VueApexCharts,
    ResultsTable,
    Loading
  },
  name: "Event",
  data() {
    return {
      displayChart: false,
      displayChartStages: false,
      radio1: "1",
      loading: true,
      event: this.$route.params.event,
      results: [],
      resultsByCategory: {},
      selectedResults: [],
      selectedCourse: "",
      selectedCategory: "Total",
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
    this.sortResults();
    this.results.forEach(result => {
      this.$set(result, "selected", false);
      if (this.resultsByCategory[result.Course] == undefined) {
        this.resultsByCategory[result.Course] = { Total: [] };
      }
      if (this.resultsByCategory[result.Course][result.Category] == undefined) {
        result.CategoryPosition = 1;
        this.resultsByCategory[result.Course][result.Category] = [result];
        this.resultsByCategory[result.Course]["Total"].push(result);
      } else {
        result.CategoryPosition =
          this.resultsByCategory[result.Course][result.Category].length + 1;
        this.resultsByCategory[result.Course][result.Category].push(result);
        this.resultsByCategory[result.Course]["Total"].push(result);
      }
    });

    this.selectedCourse = Object.keys(this.resultsByCategory).sort()[0];
    this.loading = false;
  },

  methods: {
    getTotalPos(result) {
      let data = [];
      for (let i = 1; i < this.noOfStages + 1; i++) {
        data.push(result[`TotalPos${i}`]);
      }
      return data;
    },
    sortResults() {
      this.results.sort((a, b) => {
        if (typeof a.PlacePoints === "string") {
          return 1;
        }
        if (typeof b.PlacePoints === "string") {
          return -1;
        } else {
          return a.PlacePoints > b.PlacePoints ? 1 : -1;
        }
      });
    },
    handleChange: function() {
      this.displayChart = !this.displayChart;
    },
    handleChangeStages: function() {
      this.displayChartStages = !this.displayChartStages;
    },

    updateSelectedList: function(result) {
      result.selected == true
        ? this.selectedResults.push(result)
        : this.selectedResults.splice(this.selectedResults.indexOf(result), 1);
    }
  },
  computed: {
    noOfStages() {
      let count = 0;
      Object.keys(this.results[0]).forEach(key => {
        if (key.slice(0, 11) == "ControlName") count++;
      });
      return count;
    },
    optionsStages() {
      return {
        chart: {
          height: 450,
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight",
          width: 5
        },

        // grid: {
        //   row: {
        //     colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        //     opacity: 0.5
        //   }
        // },
        xaxis: {
          title: {
            text: "Stage",
            rotate: 90
          },
          categories: this.noOfStages
        },
        yaxis: {
          title: {
            text: "Position"
          },
          //!not working
          decimalsInFloat: 0,
          forceNiceScale: true
        }
      };
    },

    //Todo: pohendli data
    seriesStages() {
      var series = [];
      if (this.selectedResults.length > 0) {
        this.selectedResults.forEach(element => {
          if (element.Time !== "") {
            series.push({
              name: element.Name,
              data: this.getTotalPos(element)
            });
          }
        });
      }
      return series;
    },

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

.selected-results-container {
  padding: 20px;
}

.filter-container {
  padding: 10px;
  margin: 0px;
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
.top-container {
  padding: 20px;
}
.smooth-enter-active,
.smooth-leave-active {
  transition: height 2s;
  overflow: hidden;
}
.smooth-enter,
.smooth-leave-to {
  height: 0;
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
.bottom-container {
  background-color: rgb(230, 238, 247);
  text-align: center;
}

.canvas-container {
  padding-left: 40px;
  padding-right: 40px;
}

.selected {
  background-color: rgba(135, 207, 235, 0.281);
}

.el-radio-group {
  margin: 3px;
}
.table {
  display: inline-block;
  background-color: rgb(230, 238, 247);
}
</style>



