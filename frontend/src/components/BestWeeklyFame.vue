<template>
	<div class="uk-grid-medium uk-child-width-expand@s uk-text-center weeklyfamecomponent" uk-grid>
        <div v-if="killFameGuild">
            <div class="uk-card uk-card-default uk-card-body">
                <h4>TOP KILL FAME GUILD</h4>
                <table class="uk-table weeklyfame">
                    <thead>
                        <th style="width: 10px;"></th>
                        <th></th>
                        <th>KILLFAME</th>
                        <th>DEATHFAME</th>
                    </thead>
                    <tr  v-for="(player, index) in killFameGuild" :key="index">
                        <td v-if="killFameGuildmax > index">#{{index + 1}}</td>
                        <td v-if="killFameGuildmax > index"><b>{{player.Name}}</b><br/>{{player.AllianceName}}</td>
                        <td v-if="killFameGuildmax > index">{{formatNumber(player.KillFame)}}</td>
                        <td v-if="killFameGuildmax > index">{{formatNumber(player.DeathFame)}}</td>
                    </tr>
                </table>
                <div class="loadmore">
                    <p v-if="killFameGuildmax < 4" @click="showMore('killFameGuildmax')">LOAD MORE <span uk-icon="chevron-down"></span></p>
                    <p v-if="killFameGuildmax > 4" @click="showLess('killFameGuildmax')">SHOW LESS<span uk-icon="chevron-up"></span></p>
                </div>
            </div>
        </div>
        <div v-if="killFamePlayer">
            <div class="uk-card uk-card-default uk-card-body">
                <h4>TOP KILL FAME PLAYER</h4>
                <table class="uk-table weeklyfame">
                    <thead>
                        <th style="width: 10px;"></th>
                        <th></th>
                        <th>KILLFAME</th>
                        <th>DEATHFAME</th>
                        <th>RATIO</th>
                    </thead>
                    <tr  v-for="(player, index) in killFamePlayer" :key="index">
                        <td v-if="killFamePlayermax > index">#{{index + 1}}</td>
                        <td v-if="killFamePlayermax > index"><b>{{player.Name}}</b><br/>{{player.GuildName}}</td>
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.KillFame)}}</td>
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.DeathFame)}}</td>
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.FameRatio)}}</td>
                    </tr>
                </table>
                <div class="loadmore">
                    <p v-if="killFamePlayermax < 4" @click="showMore('killFamePlayermax')">LOAD MORE <span uk-icon="chevron-down"></span></p>
                    <p v-if="killFamePlayermax > 4" @click="showLess('killFamePlayermax')">SHOW LESS<span uk-icon="chevron-up"></span></p>
                </div>
                    
                    <!-- <router-link :to="`/${killFamePlayer[0].GuildName}`" style="text-decoration: none;">
                        {{killFamePlayer[0].GuildName}}
                    </router-link> -->
                </div>
            </div>
        <div v-if="killFameCrystal">
            <div class="uk-card uk-card-default uk-card-body">
                <h4>TOP CRYSTAL LEAGUE PLAYER</h4>
                <table class="uk-table weeklyfame">
                    <thead>
                        <th style="width: 10px;"></th>
                        <th></th>
                        <th>KILLFAME</th>
                        <th>DEATHFAME</th>
                        <th>RATIO</th>
                    </thead>
                    <tr  v-for="(player, index) in killFameCrystal" :key="index">
                        {{player}}
                        <td v-if="killFamePlayermax > index">#{{index + 1}}</td>
                        <td v-if="killFamePlayermax > index"><b>{{player.Name}}</b><br/>{{player.GuildName}}</td>
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.KillFame)}}</td>
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.DeathFame)}}</td><!--  -->
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.FameRatio)}}</td>
                    </tr>
                </table>
                <div class="loadmore">
                    <p v-if="killFamePlayermax < 4" @click="showMore('killFamePlayermax')">LOAD MORE <span uk-icon="chevron-down"></span></p>
                    <p v-if="killFamePlayermax > 4" @click="showLess('killFamePlayermax')">SHOW LESS<span uk-icon="chevron-up"></span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'BestWeeklyFame',
    props: [],
    data: function () {
        return {
            killFamePlayer : null,
            killFameGuild : null,
            killFameCrystal : null,
            killFamePlayermax: 3,
            killFameGuildmax: 3,
        }
    },
    async mounted () {
        await axios.get(`http://localhost:5000/topFame`)
        .then( async response => {  
            this.killFamePlayer = response.data['https://gameinfo.albiononline.com/api/gameinfo/events/playerfame?range=week&limit=11&offset=0']
            this.killFameGuild = response.data['https://gameinfo.albiononline.com/api/gameinfo/events/guildfame?range=week&limit=11&offset=0']
            this.killFameCrystal = response.data['https://gameinfo.albiononline.com/api/gameinfo/matches/crystalleague/topplayers?range=week&limit=11&offset=0']
        })
    },
    methods: {
        formatNumber (num) {
            return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "." });
        },
        showMore (max) {
            this[max] = 10
        },
        showLess (max) {
            this[max] = 3
        },
    },
}
</script>

<style scoped>
.weeklyfamecomponent .uk-card {
    border-radius: 20px;
    background: #25232F;
    padding: 10px;
}
table.weeklyfame th, table.weeklyfame td {
    font-size:12px;
    padding: 4px 2px;
    text-align: center;
}
table.weeklyfame .loadmore {
    text-align: center;
    cursor: pointer;
}

</style>
