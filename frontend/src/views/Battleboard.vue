<template>
  <div class="about">
    <h1>Final Order Battles</h1>
    <div class="container" v-for="(battle, index) in battles" :key="index">
      INDEX : {{ index }}

    <div class="row">
        <div class="col s6 ">
          <span><i class="material-icons ">format_list_numbered</i>ID {{battle.id}}</span>
        </div>
        <div class="col s6">
          <i class="material-icons ">timer</i>DURATION {{battle.startTime}}
        </div>
        <div class="col s3">
          <i class="material-icons ">supervisor_account</i> TOTAL KILL : {{ battle.totalKills}}
        </div>
        <div class="col s3">
          <i class="material-icons ">star</i> TOTAL FAME : {{ battle.totalFame}}
        </div>
        <div class="col s3">
          <i class="material-icons ">star</i> NB JOUEURS : {{ Object.keys(battle.players).length }}
        </div>
        <div class="col s3">
          AVERAGE FAME PER KILL : {{ (battle.totalFame / battle.totalKills).toFixed(0)}}
        </div>
    </div>
    <!-- <router-link :to="/killboard/{{}}">Battleboard</router-link> -->
    <a class="waves-effect waves-light btn" :href="killboardURL(battle.id)"><i class="material-icons left">search</i>See battleboard</a>
        <table class="striped">
        <thead>
          <tr>
              <th>ALLIANCE</th>
              <th></th>
              <th>GUILD</th>
              <th>KILLS/DEATHS</th>
              <th>KDA</th>
              <th>KILLFAME</th>
          </tr>
        </thead>
        <tbody v-for="(guild, index) in battle.guilds" :key="index">
          <tr>
            <td>{{ guild.alliance }}</td>
            <td><span v-if="guild.id === battle.bestGuildFame.id" class="new badge orange" data-badge-caption="BEST KILLFAME"></span></td>
            <td>{{ guild.name }} ( {{guild.numbers}} )</td>
            <td>{{guild.kills}}/{{guild.deaths}}</td>
            <td>{{(guild.deaths ? guild.kills/guild.deaths : guild.kills)}}</td>
            <td>{{ guild.killFame }} ({{ ((guild.killFame*100)/ battle.totalFame).toFixed(1) }} %)</td>

          </tr>
        </tbody>
      </table>
      </div>
      <div class="container">
      <div class="row">
          <div class="col s12 m8">
            <div class="card-panel grey lighten-5 z-depth-1">
              <div class="row valign-wrapper">
                <div class="col s4 m2">
                  <img src="images/yuna.jpg" alt="" class="circle responsive-img valign">
                </div>
                <div class="col s8 m10">
                  <span class="black-text">
                    This is a square image. Add the "circle" class to it to make it appear circular.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'battles',
  data: function () {
    return {
      battles: []
    }
  },
  computed: {
  },
  components: {
  },
  methods: {
    async fetchData () {
      const response = await axios.get('http://localhost:3000/battles')
      return response
    },
    stringDate: function (date) {
      return date.toLocaleString('en-GB', { timeZone: 'UTC' })
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
      for (const player in battle.players) {
        guildNumber[battle.players[player].guildId] = 0
      }
      for (const player in battle.players) {
        guildNumber[battle.players[player].guildId] += 1
      }
      for (const guild in battle.guilds) {
        battle.guilds[guild].numbers = guildNumber[guild]
      }
    },
    killboardURL: function (battleID) {
      return 'killboard/' + battleID
    }
    /* guildBestKillFame: function (guildValues) {
      if (this.bestKillFame.killfame < guildValues.killFame) {
        this.bestKillFame.name = guildValues.name
        this.bestKillFame.killfame = guildValues.killfame
      }
    } */
  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battles = res.data
        this.battles.map(this.missGuild)
        this.battles.map(this.guildsNumber)
        // --- BEST KILL FAME MEDAL
        this.battles.forEach(battle => {
          battle.bestGuildFame = { id: 0, killfame: 0 }
          for (const guild in battle.guilds) {
            if (battle.guilds[guild].killFame > battle.bestGuildFame.killfame) {
              battle.bestGuildFame.killfame = battle.guilds[guild].killFame
              battle.bestGuildFame.id = battle.guilds[guild].id
            }
          }
        })
      })
  }
}

</script>

<style scoped>
/* @import './../assets/css/modal.css'; */
</style>
