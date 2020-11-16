<template>
	<div class="uk-grid-medium uk-child-width-expand@s uk-text-center weeklyfamecomponent uk-margin-large" uk-grid>
        <div v-if="killFameGuild" style="padding-left: 30px;">
            <div class="uk-card uk-card-default uk-card-body">
                <h4>TOP KILL FAME GUILD</h4>
                <table class="uk-table weeklyfame">
                    <thead>
                        <th style="width: 10px;"></th>
                        <th></th>
                        <th>WEEKLY KILLFAME</th>
                        <th v-if="killFameGuild[0].data">TOTAL KILLFAME</th>
                        <th v-if="killFameGuild[0].data">TOTAL DEATHFAME</th>
                    </thead>
                    <tr  v-for="(guild, index) in killFameGuild" :key="index" >
                        <td v-if="killFameGuildmax > index" style="height:40px;">#{{index + 1}}</td>
                        <td v-if="killFameGuildmax > index"><b>{{guild.Name}}</b><br/>{{guild.AllianceName}}</td>
                        <td v-if="killFameGuildmax > index">{{formatNumber(guild.KillFame)}}</td>
                        <td v-if="killFameGuildmax > index && guild.data">{{formatNumber(guild.data.guild.killFame)}}</td>
                        <td v-if="killFameGuildmax > index && guild.data">{{formatNumber(guild.DeathFame)}}</td>
                    </tr>
                </table>
                <div class="loadmore">
                    <p v-if="killFameGuildmax < 4" @click="showMore('killFameGuildmax')">LOAD MORE <span uk-icon="chevron-down"></span></p>
                    <p v-if="killFameGuildmax > 4" @click="showLess('killFameGuildmax')">SHOW LESS<span uk-icon="chevron-up"></span></p>
                </div>
            </div>
        </div>
        <div v-if="killFamePlayer" style="padding-left: 30px;">
            <div class="uk-card uk-card-default uk-card-body">
                <h4>TOP KILL FAME PLAYER</h4>
                <table class="uk-table weeklyfame">
                    <thead>
                        <th style="width: 10px;"></th>
                        <th></th>
                        <th>WEEKLY KILLFAME</th>
                        <!-- <th>DEATHFAME</th> -->
                        <th>RATIO</th>
                    </thead>
                    <tr  v-for="(player, index) in killFamePlayer" :key="index">
                        <td v-if="killFamePlayermax > index" style="height:40px;">#{{index + 1}}</td>
                        <td v-if="killFamePlayermax > index"><b>{{player.Name}}</b><br/>{{player.GuildName}}</td>
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.KillFame)}}</td>
                        <!-- <td v-if="killFamePlayermax > index">{{formatNumber(player.DeathFame)}}</td> -->
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
        <div v-if="killFameCrystal" style="padding-left: 30px;">
            <div class="uk-card uk-card-default uk-card-body" style=" min-height:300px">
                <!-- <h3>
                    You'd like to give visibility to your content? <br/>
                </h3>
                <h4>Join HHR discord or contact me!</h4>
                    <i>Video, twitch channel, guild recruitment, creation, event ...</i> -->


                
                <iframe width="400" height="280"
                    src="https://www.youtube.com/embed/Wb1CICu7g1s" frameborder="0" allowfullscreen>
                </iframe>
                <!-- <VueTwitchPlayer
                    :channel="channel"
                ></VueTwitchPlayer> -->


                <!-- <h4>TOP CRYSTAL LEAGUE PLAYER</h4>
                <table class="uk-table weeklyfame">
                    <thead>
                        <th style="width: 10px;"></th>
                        <th></th>
                        <th> WEEKLY KILLFAME</th>
                        <th>DEATHFAME</th>
                        <th>RATIO</th>
                    </thead>
                    <tr  v-for="(player, index) in killFameCrystal" :key="index" >
                        <td v-if="killFameCrystalmax > index" style="height:40px;">#{{index + 1}}</td>
                        <td v-if="killFameCrystalmax > index"><b>{{player.Name}}</b><br/>{{player.GuildName}}</td>
                        <td v-if="killFameCrystalmax > index">{{formatNumber(player.KillFame)}}</td>
                        <td v-if="killFamePlayermax > index">{{formatNumber(player.DeathFame)}}</td>
                        <td v-if="killFameCrystalmax > index">{{formatNumber(player.FameRatio)}}</td>
                    </tr>
                </table>
                <div class="loadmore">
                    <p v-if="killFameCrystalmax < 4" @click="showMore('killFameCrystalmax')">LOAD MORE <span uk-icon="chevron-down"></span></p>
                    <p v-if="killFameCrystalmax > 4" @click="showLess('killFameCrystalmax')">SHOW LESS<span uk-icon="chevron-up"></span></p>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import VueTwitchPlayer from 'vue-twitch-player';
import axios from 'axios'

export default {
    name: 'BestWeeklyFame',
    props: [],
    data: function () {
        return {
            // channel : 'derrickuk',
            killFamePlayer : null,
            killFameGuild : null,
            killFameCrystal : null,
            killFamePlayermax: 3,
            killFameGuildmax: 3,
            killFameCrystalmax: 3,
        }
    },
    async mounted () {
        await axios.get(`https://handholdreport.com/api/topFame`)
        .then( async response => {  
            this.killFamePlayer = response.data['playerFame']
            this.killFameGuild = response.data['guildFame']
            this.killFameCrystal = response.data['crystalFame']
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
    components : {
        VueTwitchPlayer,
    }
}
</script>

<style scoped>
.weeklyfamecomponent .uk-card {
    background: #f2f2f2;
}
.night .weeklyfamecomponent h4 {
    color: #dddddd;
}
.night .weeklyfame tr:nth-child(2n) {
    background: #2e2d33;
}
.weeklyfame tr:nth-child(2n) {
    background: #fcfcfc;
}
.weeklyfamecomponent .uk-card {
    border-radius: 20px;
    padding: 10px;
}
.night .weeklyfamecomponent .uk-card {
    background: #25232F;
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
