<template>
    <tr :class="highlight(player)" :id="player.name">
        <td style="max-width: 80px;position: absolute;left: -30px;">
            <span v-if="player.id === bestPlayerKillfame.id" class="uk-label uk-label-warning">KILLFAME</span>
            <span v-if="player.id === bestPlayerKill.id" class="uk-label uk-label-danger">KILLS</span>
            <span v-if="player.id === bestPlayerAssistance.id" class="uk-label uk-label-success">ASSIST</span>
            <span v-if="player.id === bestPlayerIP.id" class="uk-label bestIp">IP</span>
        </td>
        <td style="font-size:11px;">{{player.guildName}}</td>
        <td v-if="showStats && player.weapon">
            <img :uk-tooltip="weaponTooltip(player.weapon)" style="height:35px" :src="imageWeaponUri(showWeaponOrMount(player))">
        </td>
        <td style="height:30px;" v-else></td>
        <td style="text-align:left;">{{player.name}}</td>
        <td>{{player.kills}}</td>
        <td>{{player.deaths}}</td>
        <td>{{player.assistance}}</td>
        <td v-if="showHeal">{{player.healingDone.length > 0 ? formatNumber(sumArray(player.healingDone).toFixed(0)) : ''}}</td>
        <td v-if="showStats">{{player.itempower}}</td> <td v-else></td>
        <td> {{formatNumber(player.killFame)}} </td>
        <td v-if="showDeathFame">  <a v-if="player.deathFame" target="_blank" :href="`https://albiononline.com/en/killboard/kill/${player.EventId}`">{{formatNumber(player.deathFame)}}</a> </td> <!-- player.eventDeath.EventId <a v-if="player.deathFame.length" :href="`https://albiononline.com/en/killboard/kill/${player.eventDeath.EventId}`">{{player.deathFame}}</a>-->

    </tr>
</template>

<script>
import store from './store.js'

export default {
  name: 'PlayersList',
  props: ['player', 'showStats', 'showHeal', 'showDeathFame', 'searchPlayerName', 'bestPlayerKillfame', 'bestPlayerKill', 'bestPlayerAssistance', 'bestPlayerIP'],
  data: function () {
    return {
    }
  },
  methods: {
    imageWeaponUri (weaponType) {
      return `https://render.albiononline.com/v1/item/${weaponType}` // https://gameinfo.albiononline.com/api/gameinfo/items/
    },
    formatNumber (num) {
      return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
    },
    sumArray (array) {
      return array.reduce((accumulator, item) => accumulator + item, 0)
    },
    highlight (player) {
      if (player.name === this.searchPlayerName) return "highlighted"
      if (player.id === this.bestPlayerKillfame.id) return "bestKillfame"
      if (player.id === this.bestPlayerKill.id) return "bestKill"
      if (player.id === this.bestPlayerAssistance.id) return "bestAssistance"
      if (player.id === this.bestPlayerIP.id) return "bestIp"
    },
    showWeaponOrMount (player) {
        const regex = '^[^?]+'
        return player.mount && store.battlemount.includes(player.mount.match(regex)[0]) ? player.mount : player.weapon
    },
    weaponTooltip (weapon) {
      // FROM "T4_2H_TWINSCYTHE_HELL@2?quality=3" TO T4.2 2H WINSCYTHE HELL OUTSTANDING
      const regex = '^[^?]+'
      const quality = '[^=]*$'
      return `${store.quality[weapon.match(quality)[0]]} ${weapon.match(regex)[0]}`
    },
  },
  mounted () {
    
    this.player.deathFame = this.sumArray(this.player.deathFame)

  }
}
</script>

<style scoped>
</style>
