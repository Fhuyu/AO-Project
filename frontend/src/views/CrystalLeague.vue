<template>
	<div class="crystal-league">
		<div class="uk-width-4-5@m uk-margin-auto">
		<div class="uk-card uk-card-secondary uk-card-body">
			<h1 style="color:white">THIS PAGE IS STILL UNDER DEVELOPMENT</h1>PLEASE BE AWARE IT MIGHT BUG. THIS IS ONLY FOR THE FIRST FEEDBACK.
		</div>
		<BestWeeklyFame></BestWeeklyFame>

		<div>
			<h3>STATS</h3>
			<Stats :team1Timeline="t1" :team2Timeline="t2"></Stats>
		</div>

		<div uk-grid>
			<div class="uk-width-1-2">
			<PlayerSearch @playerSearch="setPlayer"></PlayerSearch>
			</div>
			<div class="uk-width-1-2">
			<CalendarSearch @dateSearch="setDate"></CalendarSearch>
			</div>
		</div>

		<Pagination
			:currentOffset="currentOffset"
			:offsetLoading="offsetLoading"
			@changeOffset="onChangeOffset"
		></Pagination>

		<div class="uk-text-right">
			<input class="uk-checkbox" type="checkbox" v-model="hideLevel1" /> Hide Crystals Level 1
		</div>
		

		<div class="uk-child-width-1-2@m uk-margin-auto" uk-grid v-if="!player">
			<div
			class="uk-card uk-card-default uk-margin-small crystal-detail m-2"
			v-for="(battle, index) in data"
			:key="index"
			>
        <GlobalOverview :battle="battle"></GlobalOverview>
			</div>
		</div>
    <div v-else><PlayerView :data="data" :player="player"></PlayerView></div>
		</div>
	</div>
</template>

<script>
import CalendarSearch from "@/components/CrystalLeague/Calendar";
import PlayerSearch from "@/components/CrystalLeague/PlayerSearch";
import GlobalOverview from "@/components/CrystalLeague/GlobalOverview";
import BestWeeklyFame from "@/components/CrystalLeague/BestWeeklyFame";
import PlayerView from "@/components/CrystalLeague/PlayerView";

import Stats from "@/components/CrystalLeague/Statistic";

import Pagination from "@/components/BattleboardPagination";

import axios from "axios";

export default {
  name: "CrystalLeague",
  props: [],
  data: function() {
    return {
      t1 : [{
        "EventType":null,"TimeStamp":"2020-10-13T13:30:40.151433300Z","Tickets":150},
        {"EventType":"3","TimeStamp":"2020-10-13T13:31:34.122548Z","Tickets":149},
        {"EventType":"4","TimeStamp":"2020-10-13T13:31:40.152672700Z","Tickets":149},
        {"EventType":"3","TimeStamp":"2020-10-13T13:32:10.505022700Z","Tickets":148},
        {"EventType":"3","TimeStamp":"2020-10-13T13:32:18.753926200Z","Tickets":147},
        {"EventType":"4","TimeStamp":"2020-10-13T13:32:40.152909400Z","Tickets":127},
        {"EventType":"4","TimeStamp":"2020-10-13T13:33:40.153147700Z","Tickets":107},
        {"EventType":"4","TimeStamp":"2020-10-13T13:34:40.153380800Z","Tickets":107},
        {"EventType":"4","TimeStamp":"2020-10-13T13:35:40.153618Z","Tickets":107},
        {"EventType":"4","TimeStamp":"2020-10-13T13:36:40.153857800Z","Tickets":107},{"EventType":"3","TimeStamp":"2020-10-13T13:37:15.085253Z","Tickets":106},{"EventType":"4","TimeStamp":"2020-10-13T13:37:40.154090600Z","Tickets":106},{"EventType":"4","TimeStamp":"2020-10-13T13:38:40.154329600Z","Tickets":106},{"EventType":"4","TimeStamp":"2020-10-13T13:39:40.154566300Z","Tickets":106},{"EventType":"4","TimeStamp":"2020-10-13T13:40:40.172865500Z","Tickets":106},{"EventType":"1","TimeStamp":"2020-10-13T13:40:40.172865500Z","Tickets":106}],
      
      t2 : [{"EventType":null,"TimeStamp":"2020-10-13T13:30:40.151433300Z","Tickets":150},{"EventType":"3","TimeStamp":"2020-10-13T13:31:17.831463600Z","Tickets":149},{"EventType":"3","TimeStamp":"2020-10-13T13:31:32.171708400Z","Tickets":148},{"EventType":"4","TimeStamp":"2020-10-13T13:31:40.152672700Z","Tickets":138},{"EventType":"4","TimeStamp":"2020-10-13T13:32:40.152909400Z","Tickets":138},{"EventType":"4","TimeStamp":"2020-10-13T13:33:40.153147700Z","Tickets":138},{"EventType":"2","TimeStamp":"2020-10-13T13:33:48.772344800Z","Tickets":134},{"EventType":"2","TimeStamp":"2020-10-13T13:33:49.552081200Z","Tickets":130},{"EventType":"2","TimeStamp":"2020-10-13T13:34:04.073961500Z","Tickets":126},{"EventType":"3","TimeStamp":"2020-10-13T13:34:22.667111800Z","Tickets":125},{"EventType":"3","TimeStamp":"2020-10-13T13:34:26.237623Z","Tickets":124},{"EventType":"4","TimeStamp":"2020-10-13T13:34:40.153380800Z","Tickets":114},{"EventType":"2","TimeStamp":"2020-10-13T13:35:00.450500500Z","Tickets":110},{"EventType":"2","TimeStamp":"2020-10-13T13:35:21.506279100Z","Tickets":106},{"EventType":"3","TimeStamp":"2020-10-13T13:35:36.903230200Z","Tickets":105},{"EventType":"4","TimeStamp":"2020-10-13T13:35:40.153618Z","Tickets":85},{"EventType":"2","TimeStamp":"2020-10-13T13:36:20.845199700Z","Tickets":81},{"EventType":"4","TimeStamp":"2020-10-13T13:36:40.153857800Z","Tickets":61},{"EventType":"2","TimeStamp":"2020-10-13T13:36:48.781085100Z","Tickets":57},{"EventType":"4","TimeStamp":"2020-10-13T13:37:40.154090600Z","Tickets":47},{"EventType":"2","TimeStamp":"2020-10-13T13:38:32.309842400Z","Tickets":43},{"EventType":"4","TimeStamp":"2020-10-13T13:38:40.154329600Z","Tickets":33},{"EventType":"2","TimeStamp":"2020-10-13T13:38:58.846827500Z","Tickets":29},{"EventType":"2","TimeStamp":"2020-10-13T13:39:25.636696900Z","Tickets":25},{"EventType":"4","TimeStamp":"2020-10-13T13:39:40.154566300Z","Tickets":15},{"EventType":"3","TimeStamp":"2020-10-13T13:39:42.596119200Z","Tickets":14},{"EventType":"4","TimeStamp":"2020-10-13T13:40:40.172865500Z","Tickets":null},{"EventType":"1","TimeStamp":"2020-10-13T13:40:40.172865500Z","Tickets":null}],
      data: null,

      // VISUAL
      offsetLoading: true,
      currentOffset: 0,

      // ORDER BY
      hideLevel1: true,

      // SEARCH DATA
      player : null,
      date : null,
    };
  },
  components: {
    GlobalOverview,
    PlayerSearch,
    BestWeeklyFame,
    Pagination,
    CalendarSearch,
    PlayerView,
    Stats,

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
    setPlayer (player) {
      this.$router.push(`/crystal-league/${player}`)
      this.player = player
      this.fetchCrystals()
    },
    setDate (date) {
      this.date = date
      this.fetchCrystals()
    },
    async fetchCrystals() {
      this.offsetLoading = true;
      // const url = `http://localhost:5000/crystalLeague/${this.currentOffset}`
      const url = `https://handholdreport.com/api/crystalLeague/${this.currentOffset}`
      await axios
        .get(url, {
          params: {
            hideLevel1: this.hideLevel1,
            player : this.player,
            date : this.date,
          }
        })
        .then(res => {
            this.data = res.data;
            this.offsetLoading = false;
            this.data.forEach(battle => {
            console.log('1 battle')
                battle.events.forEach( e => {
                    e.Participants.forEach( p => {
                        console.log('participants', p)
                        let playerId = battle.players.findIndex( player => player.Name === p.Name)
                        battle.players[playerId].Assistance = battle.players[playerId].Assistance ? battle.players[playerId].Assistance + 1 : 1
                        battle.players[playerId].MainHand = battle.players[playerId].MainHand ? battle.players[playerId].MainHand : p.MainHand
                        battle.players[playerId].Itempower = battle.players[playerId].Itempower ? battle.players[playerId].Itempower : parseInt(p.Itempower,10)
                        console.log(battle.players.findIndex( player => player.Name === p.Name))
                    })
                })
            })
        });
    }
  },
  computed: {
    // teamTimelineData: function() {
    //         return this.t1.map( t => t.Tickets)
    //     },
  },
  mounted() {
    console.log('riutrhett', this.$route.params.name) 
    if (this.$route.params.name) this.player = this.$route.params.name
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
