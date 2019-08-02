<template>
  <div>
    <div class="selectedcontainer">
      <h1>{{ $route.params.event}}</h1>
      <div id="scatter"></div>

      <!-- <div id="scatterApexcharts"></div> -->
      <!-- <div
        class="post"
        v-for="(post, index) in selectedPosts"
        v-bind:item="post"
        v-bind:index="text"
        v-bind:key="post._id">
        <a>
          <button @click="deSelect(post)">-</button>
          {{index}}{{post.name}}
        </a>
      </div>-->
    </div>
    <!-- <H2>Selected</H2>
    <div
      class="results"
      v-bind:item="selectedResults"
      v-for="(result) in selectedResults"
      v-bind:index="text"
      v-bind:key="result._id"
    >
      <a
        @click="toggleSelected(result);"
      >{{result.PlacePoints}} {{result.Name}} {{result.Team}} {{result.Time}} Display: {{result.display}} Selected: {{result.selected}}</a>
    </div>-->
    <h2>Riders</h2>
    <h2>{{selectedCourse}}</h2>

    <div v-for="(course, index) in courses" :key="index">
      <input v-model="selectedCourse" v-bind:value="course" type="radio" name="course" />
      <label>{{course}}</label>
    </div>
    <div class="container">
      <div v-if="loading" class="loadingcontainer">
        <div class="spinner">
          <div class="lds-facebook" loading>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <!-- <SemipolarSpinner :animation-duration="1100" :size="60" :color="'#ff1d5e'" /> -->
        </div>
      </div>
      <div
        class="results"
        v-bind:item="results"
        v-for="(result) in filteredResults"
        v-bind:index="text"
        v-bind:key="result._id"
        v-bind:class="{'selected': result.selected}"
      >
        <a
          @click="toggleSelected(result);"
        >{{result.PlacePoints}} {{result.Name}} {{result.Team}} {{result.Time}} Display: {{result.display}} Selected: {{result.selected}}{{result.Course}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import StatsService from "../StatsService";
import TimeConversion from "../TimeConversion";
// import { SemipolarSpinner } from "epic-spinners";

export default {
  components: {
    // SemipolarSpinner
  },
  name: "PostComponent",
  data() {
    return {
      loading: true,
      event: this.$route.params.event,
      results: [],
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
      result.display = true;
      result.selected = false;
    });
    this.loading = false;
    this.selectedCourse = this.courses[0];
    this.filterList();
  },

  methods: {
    updateSelectedList: function() {
      this.selectedResults = [];
      this.results.forEach(result => {
        if (result.selected == true) {
          this.selectedResults.push(result);
        }
      });
      this.createChart();
    },

    filterList: function() {
      this.filteredResults = [];
      this.results.forEach(result => {
        if (result.display == true && result.Course == this.selectedCourse) {
          if (result.PlacePoints == 1) {
            result.selected = true;
          }
          this.filteredResults.push(result);
        }
      });
      this.sortList(this.filteredResults);
      // this.updateSelectedList();
    },
    toggleSelected: function(result) {
      result.selected == true
        ? (result.selected = false)
        : (result.selected = true);
      this.sortList();
      this.updateSelectedList();
    },
    sortList: function(list = this.results) {
      list.sort((a, b) =>
        parseInt(a.PlacePoints) > parseInt(b.PlacePoints) ? 1 : -1
      );
    },
    createChart: function() {
      function createChartSeries(data) {
        var series = [];
        console.log(data.length);
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
          height: 350,
          type: "scatter",
          zoom: {
            enabled: true,
            type: "xy"
          }
        },
        series: createChartSeries(this.selectedResults),
        xaxis: {
          tickAmount: 10,
          labels: {
            formatter: function(val) {
              return parseFloat(val).toFixed(1);
            }
          }
        },
        yaxis: {
          tickAmount: 1
        }
      };
      document.getElementById("scatter").innerHTML = "";
      var chart = new ApexCharts(document.getElementById("scatter"), options);
      chart.render();
    }
  },
  computed: {
    courses() {
      return [...new Set(this.results.map(result => result.Course))].sort();
    }
  },
  watch: {
    // whenever question changes, this function will run
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

/* loader */
.lds-facebook {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-facebook div {
  display: inline-block;
  position: absolute;
  left: 6px;
  width: 13px;
  background: rgb(185, 239, 255);
  animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds-facebook div:nth-child(1) {
  left: 6px;
  animation-delay: -0.24s;
}
.lds-facebook div:nth-child(2) {
  left: 26px;
  animation-delay: -0.12s;
}
.lds-facebook div:nth-child(3) {
  left: 45px;
  animation-delay: 0;
}
@keyframes lds-facebook {
  0% {
    top: 6px;
    height: 51px;
  }
  50%,
  100% {
    top: 19px;
    height: 26px;
  }
}
.selected {
  background-color: rgba(135, 207, 235, 0.281);
}
</style>



// TODO:sort not working properly, make a toggle button between short and long race.