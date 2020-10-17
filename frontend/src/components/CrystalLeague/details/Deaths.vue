<template>
    <div class="">
        <table class="uk-table uk-table-divider uk-table-striped">
            <tr v-for="(event,i) in events" :key="i">
                <td>
                    {{ event.Killer.Name }}<br />
                    <small>{{ event.Killer.GuildName }}</small>
                </td>
                <td style="position: relative;padding-top: 25px;">
                    <span style="position:absolute;top: 5px;"> IP : {{ parseInt(event.Killer.Itempower) }}</span>
                    <img :src="`https://render.albiononline.com/v1/item/${event.Killer.MainHand}`" width="50" />
                    <img v-if="event.Killer.OffHand" :src="`https://render.albiononline.com/v1/item/${event.Killer.OffHand}`" width="50" />
                    <img v-if="event.Killer.Head" :src="`https://render.albiononline.com/v1/item/${event.Killer.Head}`" width="50" />
                    <img v-if="event.Killer.Armor" :src="`https://render.albiononline.com/v1/item/${event.Killer.Armor}`" width="50" />
                    <img v-if="event.Killer.Shoes" :src="`https://render.albiononline.com/v1/item/${event.Killer.Shoes}`" width="50" />
                    <img v-if="event.Killer.Cape" :src="`https://render.albiononline.com/v1/item/${event.Killer.Cape}`" width="50" />
                </td>
                
                <td class="uk-text-center">
                    KILLED <br />
                    {{ readableDate(event.TimeStamp)}}
                </td> 
                <td class="uk-text-right" style="position: relative;padding-top: 25px;">
                    <span style="position:absolute;top: 5px;"> IP : {{ parseInt(event.Victim.Itempower) }}</span>
                    <img :src="`https://render.albiononline.com/v1/item/${event.Victim.MainHand}`" width="50" />
                    <img v-if="event.Killer.OffHand" :src="`https://render.albiononline.com/v1/item/${event.Victim.OffHand}`" width="50" />
                    <img v-if="event.Killer.Head" :src="`https://render.albiononline.com/v1/item/${event.Victim.Head}`" width="50" />
                    <img v-if="event.Killer.Armor" :src="`https://render.albiononline.com/v1/item/${event.Victim.Armor}`" width="50" />
                    <img v-if="event.Killer.Shoes" :src="`https://render.albiononline.com/v1/item/${event.Victim.Shoes}`" width="50" />
                    <img v-if="event.Killer.Cape" :src="`https://render.albiononline.com/v1/item/${event.Victim.Cape}`" width="50" />
                </td>
                <td class="uk-text-right">
                    {{ event.Victim.Name }} <br />
                    <small>{{ event.Victim.GuildName }}</small>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'CrystalLeaguePlayer',
    props: ['events'],
    data: function () {
        return {
        }
    },
    components: {
    },
    methods: {
        readableDate: function (date) {
            return `${date.slice(11, 19)}`
        },

    },
    computed: {
        
    },
    mounted () {

    },
    watch: {

    }
}
</script>

<style scoped>
.night table tr {
    background: #24212f;
}
.night table tr:nth-child(2n) {
    background: #131218;
}
tr > td {
    vertical-align: middle;
}
.uk-table-striped>tr {
    border-top: none;
    border-bottom: 1px solid #333333;
}
.uk-table-striped>tr:last-child {
    border-bottom: none;
}
</style>
