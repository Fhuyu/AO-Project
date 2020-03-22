<template>
<div class="battleboard uk-container">
  <div class="uk-margin">
    <!-- <form class="uk-search uk-search-default" >
        <a href="" class="uk-search-icon-flip" uk-search-icon></a>
        <input class="uk-search-input" type="search" v-model="searchGuildName" placeholder="Search guild">
        <a type="button" class="btn btn-primary" :href="guildBattleboardURL(searchGuildName)">Valider</a>
    </form> -->
  </div>
  <div uk-accordion="multiple: true">
    <li class="uk-card uk-card-default uk-margin-small" v-for="(battle, index) in battles" :key="index">
        <a class="uk-accordion-title uk-width-4-5@m " href="#" style="font-size: 16px;">
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
        <a :href="killboardURL(battle.id)" class="uk-button uk-button-primary" style="top: 10px;right: 20px;position: absolute;">See killboard</a>
        <div class="uk-accordion-content">
          <table class="uk-table uk-table-divider uk-table-striped">
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
            <tbody v-for="(guild, index) in battle.guilds" :key="index">
              <tr>
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
</template>

<script>
import axios from 'axios'

export default {
  name: 'battles',
  data: function () {
    return {
      battles: [],
      searchGuildName: null,
      guildBattleNeeded: false
    }
  },
  components: {
  },
  methods: {
    async fetchData () {
      let response = null
      if (this.searchGuildName) {
        console.log('searching guildname')
        response = await axios.get(`http://localhost:3000/battles/${this.searchGuildName}`)
      } else {
        console.log('searching global')
        response = await axios.get('http://localhost:3000/battles')
      }
      this.guildBattleNeeded = false
      return response
    },
    async save() {
      await axios.get(`http://localhost:3000/battles/${this.searchGuildName}`)
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
    }

  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battles = res.data
        this.battles.map(this.missGuild)
        this.battles.map(this.guildsNumber)

        this.battles.forEach(battle => {
          battle.bestGuildFame = { id: '', killfame: 0 }
          battle.bestGuildKill = { id: '', kills: 0 }
          for (const guild in battle.guilds) {
            // --- BEST KILL FAME MEDAL
            if (battle.guilds[guild].killFame > battle.bestGuildFame.killfame) {
              battle.bestGuildFame.killfame = battle.guilds[guild].killFame
              battle.bestGuildFame.id = battle.guilds[guild].id
            } // --- BEST KILL MEDAL
            if (battle.guilds[guild].kills > battle.bestGuildKill.kills) {
              battle.bestGuildKill.kills = battle.guilds[guild].kills
              battle.bestGuildKill.id = battle.guilds[guild].id
            }
          }
        })
      })
  }
}

</script>

<style scoped>
@import './../assets/css/battleboard.css';
</style>
