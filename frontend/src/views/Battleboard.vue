<template>
<div class="battleboard" uk-grid>
  <div class="uk-width-4-5@m uk-margin-auto">
  <div class="uk-margin">
    <!-- <form class="uk-search uk-search-default" >
        <a href="" class="uk-search-icon-flip" uk-search-icon></a>
        <input class="uk-search-input" type="search" v-model="searchGuildName" placeholder="Search guild">
        <a type="button" class="btn btn-primary" :href="guildBattleboardURL(searchGuildName)">Valider</a>
    </form> -->
  </div>
  <div class="uk-margin">
    <button v-if="currentOffset > 1" class="uk-button" @click="changeOffset('previous')">See {{currentOffset -50}} - {{ currentOffset}} Battles</button>
    Actual battles : {{currentOffset}} - {{ currentOffset +50}}
    <button class="uk-button" @click="changeOffset('next')">See {{currentOffset +50}} - {{ currentOffset +100}} Battles</button>
  <div v-if="offsetLoading" uk-spinner></div>

  </div>
  <RequestFailed v-if="error404">
  </RequestFailed>

  <div uk-accordion="multiple: true">
    <li class="uk-card uk-card-default uk-margin-small" v-for="(battle, index) in battles" :key="index">
        <a class="uk-accordion-title uk-width-4-5@m " href="#" style="font-size: 16px;">
          <table class="result">
            <tr>
              <td class="winner">{{battle.sortedGuilds[0].name}}</td>
              <td>VS</td>
              <td class="loser">{{battle.sortedGuilds[1].name}}</td>
              <td class="other" v-if="battle.sortedGuilds[2]"> {{battle.sortedGuilds[2].name}} </td>
            </tr>
          </table>
          <table class="uk-table" style="margin-bottom:0px;bottom: 12px;position: relative;">
            <thead>
              <th>DATE</th>
              <th>PLAYERS</th>
              <th>KILLS</th>
              <th>FAME</th>
              <th>AVERAGE FAME/KILL</th>
            </thead>
            <tbody>
              <tr>
                <td>{{readableDate(battle.startTime)}}</td>
                <td>{{ Object.keys(battle.players).length }}</td>
                <td>{{ battle.totalKills}}</td>
                <td>{{ battle.totalFame}}</td>
                <td>{{ (battle.totalFame / battle.totalKills).toFixed(0)}}</td>
              </tr>
            </tbody>
          </table>

        </a>
        <router-link :to="killboardURL(battle.id)"><button class="uk-button uk-button-primary" style="top: 10px;right: 20px;position: absolute;">See killboard</button></router-link>
        <!-- <a :href="killboardURL(battle.id)" class="uk-button uk-button-primary" style="top: 10px;right: 20px;position: absolute;">See killboard</a> -->
        <div class="uk-accordion-content">
          <table class="uk-table uk-table-divider detail">
            <thead>
              <tr>
                  <th></th>
                  <th>ALLIANCE</th>
                  <th>GUILD</th>
                  <th>PLAYERS</th>
                  <th>KILLS/DEATHS</th>
                  <th>KDA</th>
                  <th>KILLFAME</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(guild, index) in battle.sortedGuilds" :key="index">
                <td>
                  <span v-if="guild.id === battle.bestGuildFame.id" class="uk-label uk-label-warning">KILLFAME</span>
                  <span v-if="guild.id === battle.bestGuildKill.id" class="uk-label uk-label-danger">KILLS</span>
                </td>
                <td>{{ guild.alliance }}</td>
                <td>{{ guild.name }}</td>
                <td>{{guild.numbers}}</td>
                <td>{{guild.kills}}/{{guild.deaths}}</td>
                <td>{{(guild.deaths ? (guild.kills/guild.deaths).toFixed(1) : guild.kills)}}</td>
                <td>{{ guild.killFame }} ({{ ((guild.killFame*100)/ battle.totalFame).toFixed(1) }} %)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
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
      error404: false,
      currentOffset: null,
      offsetLoading: false,
      guildBattleNeeded: false // ?
    }
  },
  methods: {
    async fetchData () {
      let response = null
      if (this.searchGuildName) {
        console.log('searching guildname')
        response = await axios.get(`http://localhost:3000/battles/${this.searchGuildName}`)
        .catch((error) => {
          this.error404 = true
        });
      } else {
        console.log('searching global')
        response = await axios.get(`http://localhost:3000/battles/${this.currentOffset}`)
        .catch((error) => {
          // this.error404 = true
        });
      }
      this.guildBattleNeeded = false
      return response
    },
    /* async save() {
      await axios.get(`http://localhost:3000/battles/${this.searchGuildName}`)
      .catch((error) => {
          this.error404 = true
        });
    }, */
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
        // battle.alliances.missingAlliance = { name: 'No Alliance', killFame: killfame, kills: kills, deaths: deaths } TODO
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
    guildBattleboardURL: function (guildName) {
      this.guildBattleNeeded = true
      return '/' + guildName
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
        // this.currentOffset += 50
        console.log(this.currentOffset)
        this.fetchData()
      }

  },
  mounted () {
    this.currentOffset = 0
    
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
      })
    }
  }
}

</script>

<style scoped>
@import './../assets/css/battleboard.css';
</style>
