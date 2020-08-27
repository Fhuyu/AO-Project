<template>
<div class="battleboard" uk-grid>

	<!-- <div v-if="initialLoader" class="uk-margin-auto" style="text-align:center;"> 
		<h1 style="color:white;" v-if="searchGuildName"> {{ searchGuildName.toUpperCase() }}</h1>
		<div  v-if="!error404">
		<h1 style="color:white;">Loading last battles</h1>
		<div uk-spinner="ratio: 3"></div>
		</div>
		<RequestFailed v-if="error404">
		</RequestFailed>
	</div> -->

	<div v-if="!initialLoader" class="uk-width-4-5@m uk-margin-auto" style="z-index:1;">
	<BestWeeklyFame></BestWeeklyFame>



		<div class="uk-child-width-1-3 uk-text-center uk-margin-medium uk-margin-medium-top" uk-grid>
			<div class="form_global_search uk-text-left uk-width-auto@m">
				<form class="form_search" @submit.prevent="launchGuildSearch(searchGuildName)">
					<div class="select_div" uk-form-custom="target: > * > span:first-child">
						<select v-model="searchType" @change="cleanName" class="uk-select">
							<option value="guild">Guild</option>
							<option value="alliance">Alliance</option>
							<!-- <option value="player">Player</option> -->
						</select>
						<button class="" type="button" tabindex="-1">
							<span></span>
							<span uk-icon="icon: chevron-down" style="padding-left:5px"></span>
						</button>
					</div>
					<input class="" v-model="searchGuildName"  :placeholder="searchType === 'guild' ? 'Search Guild Name' :'EXACT name (uppercase...)'">
					<span class="icon right" @click="launchGuildSearch(searchGuildName)" uk-icon="icon: search; ratio: 1.5"></span>
				</form>
			</div>
			<div class="uk-width-expand@m">
			</div>
			<div class="uk-width-auto@m">
				<form class="uk-form-horizontal">
					<select class="uk-select playerFilter" v-model="minBattlePlayers" @change="launchMinbattleSearch">
						<option value="0">0 + players</option>
					<option value="20">20 + players</option>
					<option value="50">50 + players</option>
					<option value="100">100 + players</option>
					</select>
				</form>
			</div>
		</div>
    <!-- PAGINATION -->
		<Pagination :currentOffset="currentOffset" :offsetLoading="offsetLoading" :searchGuildName="searchGuildName" @changeOffset="onChangeOffset"></Pagination>



    <RequestFailed v-if="error404">
    </RequestFailed>
  <table class="uk-table header_result" style="margin-bottom:0px;bottom: 12px;position: relative;">
    <thead>
      <th style="width:12%">DATE</th>
      <th style="width:6%">PLAYERS</th>
      <th style="width:5%">KILLS</th>
      <th style="width:15%">WINNING GUILD</th>
      <th style="width:15%">LOSING GUILD</th>
      <th style="width:15%">OTHER GUILDS</th>
      <th style="width:12%">KILL FAME</th>
      <th></th>
    </thead>
  </table>

  <div uk-accordion="multiple: true">
    <li class="uk-card uk-card-default uk-margin-small" v-for="(battle, index) in battles" :key="index">
        <a class="uk-accordion-title uk-width-4-5@m " href="#" style="font-size: 16px;">
          <table class="uk-table result" style="margin-bottom:0px;bottom: 12px;position: relative;">
            <tbody>
              <tr>
                <td width="180" style="max-width:180px!important;">{{readableDate(battle.startTime)}}</td>
                <td width="80">{{ Object.keys(battle.players).length }}</td>
                <td width="70">{{ battle.totalKills}}</td>
                <td width="220" class="winner">{{battle.sortedGuilds[0].name}}</td>
                <td width="220" class="loser" v-if="battle.sortedGuilds[1]">{{battle.sortedGuilds[1].name}}</td>
                <td width="220" class="other" v-if="battle.sortedGuilds[2]"> {{battle.sortedGuilds[2].name}} </td>
                <td v-else width="220"></td>
                <td width="180">{{ formatNumber(battle.totalFame)}}</td>
              </tr>
            </tbody>
          </table>

        </a>
        <router-link :to="killboardURL(battle.id)"><button class="uk-button uk-button-primary" style="height: 100%;top: 0px;right: 2px;position: absolute;">
			<span class="icon right" uk-icon="icon: search; ratio: 1.5"></span>
        </button></router-link>
        <div class="uk-accordion-content">
			<table class="uk-table uk-table-divider detail">
				<thead>
				<tr>
					<th></th>
					<th>ALLIANCE</th>
					<th>GUILD</th>
					<th>PLAYERS</th>
					<th>KILLS/DEATHS</th>
					<th>KILLFAME</th>
          <th></th>
          <th></th>
				</tr>
				</thead>
            <tbody>
              <tr class="guilds" v-for="(guild, index) in battle.sortedGuilds" :key="index">
                <td>
                  <span v-if="guild.id === battle.bestGuildFame.id" class="uk-label uk-label-warning">KILLFAME</span>
                  <span v-if="guild.id === battle.bestGuildKill.id" class="uk-label uk-label-danger">KILLS</span>
                </td>
                <td>{{ guild.alliance }}</td>
                <td>{{ guild.name }}</td>
                <td>{{guild.numbers}}</td>
                <td>{{guild.kills}} / {{guild.deaths}}</td>
                <td>{{formatNumber(guild.killFame) }} ({{ ((guild.killFame*100)/ battle.totalFame).toFixed(1) }} %)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
  </div>
  <!-- PAGINATION -->
  <Pagination :currentOffset="currentOffset" :offsetLoading="offsetLoading" @changeOffset="onChangeOffset"></Pagination>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import RequestFailed from "@/components/RequestFailed"
import Pagination from "@/components/BattleboardPagination"
import BestWeeklyFame from "@/components/BestWeeklyFame"

export default {
  name: 'battles',
  components: {
    RequestFailed,
	Pagination,
	BestWeeklyFame,
  },
  data: function () {
    return {
      battles: [],
      searchGuildName: this.$route.params.guildName,
      searchType : this.$route.query.search ? this.$route.query.search : 'guild',
      error404: false,
      currentOffset: null,
      initialLoader: false,
      offsetLoading: false,
      onClickSearchGuildPlayer: false,
      minBattlePlayers: "0",
      sortedByPlayersBattle: [],
    }
  },
  methods: {
    async fetchData () {
      let response = null
      if (this.searchGuildName) {
        response = await axios.get(`http://localhost:5000/battles/${this.currentOffset}/${this.searchGuildName}`, //https://handholdreport.com/api/
          { params: {
              minBattlePlayers : this.minBattlePlayers,
              searchType : this.searchType
            }
          }
        ) 
        .catch((error) => {
          this.error404 = true
        });
      } else {
        response = await axios.get(`http://localhost:5000/battles/${this.currentOffset}`,  //http://localhost:5000
          { params: {
              minBattlePlayers : this.minBattlePlayers,
              searchType : this.searchType // NOT USEFULL
            }
          }
        )
        .catch((error) => {
          this.error404 = true
        });
      }
      return response
    },
    missGuild: function (battle) {
      const kdaratio = {}
      const killsratio = {}
      const deathsratio = {}

      for (const player in battle.players) {
        kdaratio[battle.players[player].guildName] = []
        killsratio[battle.players[player].guildName] = []
        deathsratio[battle.players[player].guildName] = []
      }
      for (const player in battle.players) {
        kdaratio[battle.players[player].guildName].push(battle.players[player].killFame)
        killsratio[battle.players[player].guildName].push(battle.players[player].kills)
        deathsratio[battle.players[player].guildName].push(battle.players[player].deaths)
      }
      if (kdaratio['']) {
        const killfame = kdaratio[''].reduce((accumulator, item) => accumulator + item, 0)
        const kills = killsratio[''].reduce((accumulator, item) => accumulator + item, 0)
        const deaths = deathsratio[''].reduce((accumulator, item) => accumulator + item, 0)
        battle.guilds.missingguild = { name: 'No Guild', killFame: killfame, kills: kills, deaths: deaths }
      }
    },
    guildsNumber: function (battle) {
      const guildNumber = {}
      // INITIALIZE GUILDID: NUMBER
      for (const player in battle.players) {
        guildNumber[battle.players[player].guildId] = 0
      }
      // CALCUL GUILDID: NUMBER
      for (const player in battle.players) {
        guildNumber[battle.players[player].guildId] += 1
      }
      // ATTRIBUTE NUMBERS TO EVERY GUILD
      for (const guild in battle.guilds) {
        battle.guilds[guild].numbers = guildNumber[guild]
      }
    },
    cleanName: function () {
      this.searchGuildName = ''
    },
    launchGuildSearch: function (guildName) {
      this.$router.push({ path: `${this.searchGuildName}`, query: { search: this.searchType } })
      this.currentOffset = 0
      this.minBattlePlayers = 0
      this.launchNewSearch()
    },
    launchMinbattleSearch: function () {
      if(this.searchGuildName) this.$router.push({ path: `${this.searchGuildName}`, query: { search: this.searchType } })
      this.currentOffset = 0
      this.launchNewSearch()
    },
    killboardURL: function (battleID) {
      return 'killboard/' + battleID
    },
    readableDate: function (date) {
      return `${date.slice(0, 10)} ${date.slice(11, 19)}`
    },
    OrderBy (battle, currentSortName, currentSortDir) {
        battle.sortedGuilds.sort((a, b) => {
            let modifier = 1
            if (currentSortDir === 'desc') {
                modifier = -1
            }
            if (a[currentSortName] < b[currentSortName]) return -1 * modifier
            if (a[currentSortName] > b[currentSortName]) return 1 * modifier
            return 0
        })
    },
    onChangeOffset (offset) {
      this.currentOffset = offset
    },
    formatNumber (num) {
      return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    },
    launchNewSearch () {
      this.offsetLoading = true
      this.fetchData()
      .then(res => {
        this.battles = res.data
        this.battles.map(this.missGuild)
        this.battles.map(this.guildsNumber)

        this.battles.forEach(battle => {
          battle.bestGuildFame = { id: '', killfame: 0 }
          battle.bestGuildKill = { id: '', kills: 0 }
          battle.sortedGuilds = []

          for (const guild in battle.guilds) {
            battle.sortedGuilds.push(battle.guilds[guild]) // = this.battle.guilds ?
            // --- BEST KILL FAME MEDALbattle.guilds[guild]
            if (battle.guilds[guild].killFame > battle.bestGuildFame.killfame) {
              battle.bestGuildFame.killfame = battle.guilds[guild].killFame
              battle.bestGuildFame.id = battle.guilds[guild].id
            } // --- BEST KILL MEDAL
            if (battle.guilds[guild].kills > battle.bestGuildKill.kills) {
              battle.bestGuildKill.kills = battle.guilds[guild].kills
              battle.bestGuildKill.id = battle.guilds[guild].id
            }
          }
          this.OrderBy(battle, 'killFame', 'desc')
          this.offsetLoading = false
          this.initialLoader = false
        })
      })
    }

  },
  mounted () {
    this.currentOffset = 0
    if (this.currentOffset === 0) this.initialLoader = true // Condition needed ?
    
  },
  watch: {
    currentOffset: function () {
      this.launchNewSearch()
    },
  }
}

</script>

<style scoped>
@import './../assets/css/battleboard.css';
</style>
