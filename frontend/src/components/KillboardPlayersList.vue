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
            <img :uk-tooltip="player.weapon.Type" style="height:35px" :src="imageWeaponUri(showWeaponOrMount(player))">
        </td>
        <td style="height:30px;" v-else></td>
        <td style="text-align:left;">{{player.name}}</td>
        <td>{{player.kills}}</td>
        <td>{{player.deaths}}</td>
        <td>{{player.assistance}}</td>
        <!-- <td v-if="showStats">{{sumArray(player.damageDone).toFixed(0)}}</td> <td v-else></td> -->
        <td v-if="showStats">{{formatNumber(sumArray(player.healingDone).toFixed(0)) > 0 ? formatNumber(sumArray(player.healingDone).toFixed(0)) : ''}}</td> <td v-else><!-- <div uk-spinner></div> --></td>
        <td v-if="showStats">{{player.itempower}}</td> <td v-else></td>
        <td> {{formatNumber(player.killFame)}} </td>
        <td v-if="showDeathFame"> <a v-if="player.eventDeath" :href="`https://albiononline.com/en/killboard/kill/${player.eventDeath.EventId}`">{{formatNumber(player.deathFame)}}</a> </td> <!-- player.eventDeath.EventId -->

    </tr>
</template>

<script>
export default {
  name: 'PlayersList',
  props: ['player', 'showStats', 'showDeathFame', 'searchPlayerName', 'bestPlayerKillfame', 'bestPlayerKill', 'bestPlayerAssistance', 'bestPlayerIP'],
  data: function () {
    return {
    }
  },
  methods: {
    imageWeaponUri (weaponType) {
      return `https://gameinfo.albiononline.com/api/gameinfo/items/${weaponType}`
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
      if (player.mount.Type === 'T8_MOUNT_MAMMOTH_BATTLE@1' ||
        player.mount.Type === 'T6_MOUNT_SIEGE_BALLISTA' ||
        player.mount.Type === 'UNIQUE_MOUNT_BEETLE_GOLD' ||
        player.mount.Type === 'UNIQUE_MOUNT_BEETLE_SILVER' ||
        player.mount.Type === 'UNIQUE_MOUNT_BEETLE_CRYSTAL' ||
        player.mount.Type === 'UNIQUE_MOUNT_ARMORED_EAGLE_GOLD' ||
        player.mount.Type === 'UNIQUE_MOUNT_ARMORED_EAGLE_CRYSTAL' ||
        player.mount.Type === 'UNIQUE_MOUNT_ARMORED_EAGLE_SILVER') {
          return player.mount.Type
      } else {
        return player.weapon.Type
      }
    }
  }
}
</script>

<style scoped>
</style>
