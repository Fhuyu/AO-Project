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
        <div class="col s4">
          <i class="material-icons ">supervisor_account</i> TOTAL KILL : {{ battle.totalKills}}
        </div>
        <div class="col s4">
          <i class="material-icons ">star</i> TOTAL FAME : {{ battle.totalFame}}
        </div>
        <div class="col s4">
          AVERAGE FAME PER KILL : {{ (battle.totalFame / battle.totalKills).toFixed(0)}}
        </div>
    </div>
    <a class="waves-effect waves-light btn"><i class="material-icons left">search</i>See battleboard</a>
        <table class="striped">
        <thead>
          <tr>
              <th>ALLIANCE</th>
              <th>GUILD</th>
              <th>KILLS/DEATHS</th>
              <th>KDA</th>
              <th>KILLFAME</th>
          </tr>
        </thead>
        <tbody  v-for="(guild, index) in battle.guilds" :key="index">
          <tr>
            <td>{{ guild.alliance }}</td>
            <td>{{ guild.name }} ( {{guild.numbers}} )</td>
            <td>{{guild.kills}}/{{guild.deaths}}</td>
            <td>{{(guild.deaths ? guild.kills/guild.deaths : guild.kills)}}</td>
            <td>{{ guild.killFame }} ({{ ((guild.killFame*100)/ battle.totalFame).toFixed(1) }} %)</td>
          </tr>
        </tbody>
      </table>
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
      bestKillFame: { name: '', killfame: 0 }
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
        /* this.battles.forEach(battle => {
          for (const guild in battle.guilds) {
            console.log(battle.guilds[guild])
            battle.bestkdaaa = this.guildBestKillFame(battle.guilds[guild])
          }
        }) */
      })
  }
}

</script>

<style scoped>
/* @import './../assets/css/modal.css'; */
</style>
