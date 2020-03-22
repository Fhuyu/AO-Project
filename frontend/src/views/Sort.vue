<template>
  <div class="uk-container-xlarge uk-margin-auto">
    BATTLE
    <div class="uk-button-group">
        <button @click="sort('guildName')" class="uk-button uk-button-secondary">GUILDNAME
            <span v-if="currentSort === 'guildName' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'guildName' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button @click="sort('name')" class="uk-button uk-button-secondary">NAME
            <span v-if="currentSort === 'name' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'name' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
        <button @click="sort('killFame')" class="uk-button uk-button-secondary">KILLFAME
            <span v-if="currentSort === 'killFame' && currentSortDir === 'desc'" uk-icon="arrow-up"></span>
            <span v-if="currentSort === 'killFame' && currentSortDir === 'asc'" uk-icon="arrow-down"></span>
        </button>
    </div>
<ul uk-grid="masonry: true" uk-accordion="multiple: true" class="uk-grid-collapse">
    <li class="uk-open uk-width-2-5 uk-card uk-card-default uk-padding-small uk-margin-small-bottom" v-for="(alliance, indexa) in battle.alliances" :key="indexa">
        <a class="uk-accordion-title" href="#">{{ alliance.name }} | KDA : {{ alliance.kills }} / {{ alliance.deaths }} | KILLFAME : {{ alliance.killFame }}</a>
        <div class="uk-accordion-content">
            <table class="uk-table uk-table-divider uk-table-striped" style="position:relative;margin:10px">
          <thead>
          <tr>
              <td></td> <!-- Badge -->
              <td @click="sort('guildName')">Guild</td>
              <td @click="sort('name')">Name</td>
              <td>Kills</td>
              <td>Deaths</td>
              <td @click="sort('killFame')"> Kill Fame </td>
          </tr>
        </thead>
        <tbody >
                <tr v-for="player in alliance.players" :key="player.id">
                  <td>
                    <span v-if="values(player).id === bestPlayerKillfame.id" class="uk-label uk-label-warning">KILLFAME</span>
                    <span v-if="values(player).id === bestPlayerKill.id" class="uk-label uk-label-danger">KILLS</span>
                  </td>
                  <td>{{player.guildName}}</td>
                  <td>{{player.name}}</td>
                  <td>{{player.kills}}</td>
                  <td>{{player.deaths}}</td>
                  <td> {{player.killFame}} </td>

                </tr>

              </tbody>
             </table>
        </div>
    </li>
</ul>
  </div>
</template>

<script>
import axios from 'axios'

/*   */

export default {
  name: 'Battle',
  data: function () {
    return {
      battle: [],
      refreshStats: [],
      bestPlayerKillfame: { id: '', killfame: 0 },
      bestPlayerKill: { id: '', kill: 0 },
      showWeapon: false,
      currentSort: 'killFame',
      currentSortDir: 'desc',
      reload: 0,
    }
  },
  components: {
  },
  methods: {
    values (player) {
      return player[Object.keys(player)[0]]
    },
    async fetchData () {
      const response = await axios.get(`http://localhost:3000/killboard/${this.$route.params.id}`) // Passer la battle en props ?? plutot que de request
      return response
    },
    sort: function (column) {
      console.log(this.currentSort)
      console.log('clicked', column)
      if (column === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = column
      this.reload += 1
      console.log(this.currentSort)
    }

  },
  computed: {
  },
  mounted () {
    this.fetchData()
      .then(res => {
        this.battle = res.data // EVENT NOT USEFULL
        this.showWeapon = true
        // this.getPlayerDeath()
      })
  },
  watch: {
    showWeapon: function () {
      for (const playerID in this.battle.players) {
        console.log('ALLIANCE DU JOUEUR : ', this.battle.players[playerID])
        if (this.battle.players[playerID].allianceId) {
          console.log('ALLIANCE DU JOUEUR : ', this.battle.players[playerID].allianceId)
          const playerAlliance = this.battle.players[playerID].allianceId
          this.battle.alliances[playerAlliance].players.push(this.battle.players[playerID])
          console.log('ALLIANCE DU JOUEUR UPDATED: ', this.battle.alliances[playerAlliance])
        }
        this.reload += 1
      }
    },
    reload: function () {
        for (const alliance in this.battle.alliances) {
            console.log
            this.battle.alliances[alliance].sortedPlayers = this.battle.alliances[alliance].players.sort((a, b) => {
                let modifier = 1
                if (this.currentSortDir === 'desc') {
                    modifier = -1
                }
                if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
                if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
                return 0
            })
        }
        
        }
    }
}
// DANS LE TABLEAU DES GUILDES, POUR CHAQUE GUILDES (TABLEAU) AVOIR TOUS SES JOUEURS (OBJ)
</script>

<style scoped>
@import './../assets/css/killboard.css';
</style>
