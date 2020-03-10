<template>
  <div class="about">
    <h1>Final Order Battles</h1>
    <div class="container" v-for="(battle, index) in battles" :key="index">
      INDEX : {{ index }}
      {{stringDate(battle.startTime)}}
       TOTAL FAME : {{ battle.totalFame}}
        <!-- Page Content goes here -->
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
            <td>{{ guild.killFame }} ({{ (guild.killFame*100)/ battle.totalFame}} %)</td>
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
      console.log(guildNumber)
      console.log(battle.guilds)

      for (const guild in battle.guilds) {
        battle.guilds[guild].numbers = guildNumber[guild]
      }
    }

  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battles = res.data
        this.battles.map(this.missGuild)
        this.battles.map(this.guildsNumber)
      })
  }
}

</script>

<style scoped>
/* @import './../assets/css/modal.css'; */
</style>
