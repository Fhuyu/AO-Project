<template>
  <div class="crystal-league">
    <div class="uk-width-4-5@m uk-margin-auto">
      <div class="uk-card uk-card-secondary uk-card-body">
        <h1 style="color:white">THIS PAGE IS STILL UNDER DEVELOPMENT</h1>PLEASE BE AWARE IT MIGHT BUG. THIS IS ONLY FOR THE FIRST FEEDBACK.
      </div>
      <BestWeeklyFame></BestWeeklyFame>
      <PlayerSearch></PlayerSearch>

      <Pagination
        :currentOffset="currentOffset"
        :offsetLoading="offsetLoading"
        @changeOffset="onChangeOffset"
      ></Pagination>

      <div class="uk-text-right">
        <input class="uk-checkbox" type="checkbox" v-model="hideLevel1" /> Hide Crystals Level 1
      </div>

      <div class="uk-child-width-1-2@m uk-margin-auto" uk-grid>
        <div
          class="uk-card uk-card-default uk-margin-small crystal-detail m-2"
          v-for="(battle, index) in data"
          :key="index"
        >
          <GlobalOverview :battle="battle"></GlobalOverview>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerSearch from "@/components/CrystalLeague/PlayerSearch";
import GlobalOverview from "@/components/CrystalLeague/GlobalOverview";
import BestWeeklyFame from "@/components/CrystalLeague/BestWeeklyFame";

import Pagination from "@/components/BattleboardPagination";

import axios from "axios";

export default {
  name: "CrystalLeague",
  props: [],
  data: function() {
    return {
      data: null,

      // VISUAL
      offsetLoading: true,
      currentOffset: 0,

      // ORDER BY
      hideLevel1: true
    };
  },
  components: {
    GlobalOverview,
    PlayerSearch,
    BestWeeklyFame,
    Pagination
  },
  methods: {
    playersArray(playerObj) {
      let playersID = Object.keys(playerObj);
      let players = Object.values(playerObj);
      return players.map((player, i) => ({ ...player, id: playersID[i] }));
    },
    onChangeOffset(offset) {
      console.log(offset);
      this.currentOffset = offset;
    },
    async fetchCrystals() {
      this.offsetLoading = true;
      await axios
        // .get(`http://localhost:5000/crystalLeague/${this.currentOffset}`, {
        .get(`https://handholdreport.com/api/crystalLeague/${this.currentOffset}`, {
          params: {
            hideLevel1: this.hideLevel1
          }
        })
        .then(res => {
          this.data = res.data;
          this.offsetLoading = false;
          // this.data.forEach(battle => {
          //     battle.team1Results = this.playersArray(battle.team1Results)
          //     battle.team2Results = this.playersArray(battle.team2Results)
          // })
        });
    }
  },
  computed: {},
  mounted() {
    this.fetchCrystals();
  },
  watch: {
    currentOffset: function() {
      this.fetchCrystals();
	},
	hideLevel1: function() {
      this.fetchCrystals();
    }
  }
};
</script>

<style scoped>
.night .crystal-league {
  background-color: #05081c;
}
.crystal-detail .result {
  font-size: 24px;
}
.crystal-detail {
  width: 45%;
  margin: 1% 2% !important;
  padding-left: 0;
}
.crystal-detail td {
  vertical-align: middle;
}
.crystal-detail img {
  width: 20px;
}
.crystal-detail .result.win {
  color: green;
}
.crystal-detail .result.lose {
  color: red;
}
.night .crystal-detail {
  background: #24212f;
}
</style>
