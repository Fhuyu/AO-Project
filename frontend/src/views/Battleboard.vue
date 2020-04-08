<template>
<div class="battleboard" uk-grid>
  <div class="uk-width-4-5@m uk-margin-auto">
    <div class="uk-child-width-1-2 uk-text-center uk-margin" uk-grid>
      <!-- <form class="uk-search uk-search-default" > -->
          <!-- <a href="" class="uk-search-icon-flip" uk-search-icon></a> -->
        <div>
          <input class="uk-input search guild" type="search" v-model="searchGuildName" placeholder="Search guild">
          <button class="uk-button" @click="launchGuildSearch(searchGuildName)">Valider</button>
      <!-- </form> -->
      </div>
      <div>
        <form class="uk-form-horizontal">
        <label class="uk-form-label" for="form-horizontal-select" style="color: white;font-size: 16px;">Filter current battles by</label>
        <div class="uk-form-controls">
        <select @change="onChangeFilterPlayer" class="uk-select" v-model="minBattlePlayers">
              <option value="0">0+ players</option>
              <option value="20">20+ players</option>
              <option value="50">50+ players</option>
              <option value="100">100+ players</option>
          </select>
          </div>
        </form>
      </div>
    </div>

    <div class="uk-margin">
      <button v-if="currentOffset > 1" class="uk-button" @click="changeOffset('previous')">See {{currentOffset -50}} - {{ currentOffset}} Battles</button>
      Actual battles : {{currentOffset}} - {{ currentOffset +50}}
      <button class="uk-button" @click="changeOffset('next')">See {{currentOffset +50}} - {{ currentOffset +100}} Battles</button>
      <div v-if="offsetLoading" uk-spinner></div>
    </div>

    <RequestFailed v-if="error404">
    </RequestFailed>
  <table class="uk-table header_result" style="margin-bottom:0px;bottom: 12px;position: relative;">
    <thead>
      <th width="180">DATE</th>
      <th width="80">PLAYERS</th>
      <th width="70">KILLS</th>
      <th width="220">WINNING GUILD</th>
      <th width="220">LOSING GUILD</th>
      <th width="220">OTHER GUILDS</th>
      <th width="180">KILL FAME</th>
      <th></th>
    </thead>
  </table>

  <div uk-accordion="multiple: true">
    <li class="uk-card uk-card-default uk-margin-small" v-for="(battle, index) in sortedByPlayersBattle" :key="index">
        <a class="uk-accordion-title uk-width-4-5@m " href="#" style="font-size: 16px;">
          <table class="uk-table result" style="margin-bottom:0px;bottom: 12px;position: relative;">
            <tbody>
              <tr>
                <td width="180">{{readableDate(battle.startTime)}}</td>
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
        <router-link :to="{ name: 'Killboard', params: { id: battle.id, battle: battle } }"><button class="uk-button uk-button-primary aa" style="height: 44px;top: 0px;right: 2px;position: absolute;">See killboard</button></router-link>
        <!-- <router-link :to="killboardURL(battle.id)"><button class="uk-button uk-button-primary" style="height: 44px;top: 0px;right: 2px;position: absolute;">See killboard</button></router-link> -->
        <div class="uk-accordion-content">
          <table class="uk-table uk-table-divider detail">
            <thead>
              <tr>
                  <th></th>
                  <th>ALLIANCE</th>
                  <th>GUILD</th>
                  <th>PLAYERS</th>
                  <th>KILLS/DEATHS</th>
                  <th>KD RATIO</th>
                  <th>KILLFAME</th>
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
                <td>{{(guild.deaths ? (guild.kills/guild.deaths).toFixed(1) : guild.kills)}}</td>
                <td>{{formatNumber(guild.killFame) }} ({{ ((guild.killFame*100)/ battle.totalFame).toFixed(1) }} %)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
  </div>
  <div class="uk-margin">
    <button v-if="currentOffset > 1" class="uk-button" @click="changeOffset('previous')">See {{currentOffset -50}} - {{ currentOffset}} Battles</button>
    Actual battles : {{currentOffset}} - {{ currentOffset +50}}
    <button class="uk-button" @click="changeOffset('next')">See {{currentOffset +50}} - {{ currentOffset +100}} Battles</button>
    <div v-if="offsetLoading" uk-spinner></div>
  </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import RequestFailed from "@/components/RequestFailed"

export default {
  name: 'battles',
  components: {
    RequestFailed,
  },
  data: function () {
    return {
      battles: [],
      searchGuildName: null,
      searchPlayerName: null,
      error404: false,
      currentOffset: null,
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
        response = await axios.get(`http://localhost:3000/battles/${this.currentOffset}/${this.searchGuildName}`) //https://handholdreport-backend.herokuapp.com
        .catch((error) => {
          this.error404 = true
        });
      } /* else if (this.searchPlayerName) {
        response = await axios.get(`http://localhost:8000/battles/${this.currentOffset}/player/${this.searchPlayerName}`)
        .catch((error) => {
          this.error404 = true
        });
      } */ else {
        response = await axios.get(`http://localhost:3000/battles/${this.currentOffset}`)
        .catch((error) => {
          // this.error404 = true
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
    launchGuildSearch: function (guildName) {
      this.searchPlayerName = null,
      this.onClickSearchGuildPlayer = true
    },
    launchPlayerSearch: function (guildName) {
      console.log('search player')
      this.searchGuildName = null,
      this.onClickSearchGuildPlayer = true
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
    changeOffset (step) {
      this.currentOffset += step === 'next' ? 50 : -50
      this.fetchData()
    },
    formatNumber (num) {
      return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    },
    onChangeFilterPlayer () {
      this.sortedByPlayersBattle = this.battles.filter( battle =>  Object.keys(battle.players).length >= parseInt(this.minBattlePlayers)
      )
    }

  },
  mounted () {
    this.currentOffset = 0
    this.$router.myProps = 'hello'
    
  },
  watch: {
    currentOffset: function () {
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
        })
          this.onChangeFilterPlayer()
      })
    },
    onClickSearchGuildPlayer: function () {
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
          this.onClickSearchGuild = false // LOOP ON HIMSELF
        })
          this.onChangeFilterPlayer()
      })
    }
  }
}

</script>

<style scoped>
@import './../assets/css/battleboard.css';
</style>
