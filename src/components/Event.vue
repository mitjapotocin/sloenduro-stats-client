<template>
  <div>
    <h1>{{ $route.params.event}}</h1>
    <div id="scatter"></div>
    <vue-apex-charts type="scatter" :options="options2" :series="series2"></vue-apex-charts>

    <h2>Riders</h2>

    <h2>{{selectedCourse}}</h2>

    <div v-for="(course, index) in courses" :key="index">
      <input v-model="selectedCourse" v-bind:value="course" type="radio" name="course" />
      <label>{{course}}</label>
    </div>

    <div class="container">
      <loading v-if="loading"></loading>
      <results-table v-bind:results="filteredResults"></results-table>
    </div>
  </div>
</template>

<script>
import StatsService from "../StatsService";
import TimeConversion from "../TimeConversion";
import ResultsTable from "./ResultsTable";
import Loading from "./Loading";
import ApexCharts from "apexcharts";
import VueApexCharts from "vue-apexcharts";

export default {
  components: {
    VueApexCharts,
    ResultsTable,
    Loading
  },
  name: "Event",
  data() {
    return {
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
    updateSelectedList: function() {
      this.selectedResults = [];
      this.filteredResults.forEach(result => {
        if (result.selected == true) {
          this.selectedResults.push(result);
        }
      });
      this.createChart();
    },
    filterList: function() {
      this.filteredResults = [];
      this.results.forEach(result => {
        if (result.Course == this.selectedCourse) {
          if (result.PlacePoints == 1) {
            result.selected = true;
          }
          this.filteredResults.push(result);
        }
      });
    },

    createChart: function() {
      function createChartSeries(data) {
        var series = [];
        if (data.length > 0) {
          data.forEach(element => {
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

      var options = {
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
        series: createChartSeries(this.selectedResults),
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
        }
      };
      document.getElementById("scatter").innerHTML = "";
      var chart = new ApexCharts(document.getElementById("scatter"), options);
      chart.render();
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
  text-align: left;
}
.canvas-container {
  padding-left: 40px;
  padding-right: 40px;
}

.selected {
  background-color: rgba(135, 207, 235, 0.281);
}
</style>



