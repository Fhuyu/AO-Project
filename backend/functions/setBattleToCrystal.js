const axios = require("axios");

const mongoose = require('mongoose')
const Crystal = require('../models/Crystal')
const Battle = require('../models/Battle')

cleanEvent = require("./cleanEvent");

module.exports = {
    setBattleToCrystal: async function() {
        console.log('fetch crystal aa')

        let crystals = await Crystal.find({ battleID: 0, level: { $gt: 1 } }).sort({ startTime: -1 }).limit(100)
            // console.log('crystals', crystals.length)

        let battles = await Battle.find({ 'battleTotalPlayers': { $eq: 10 } }).sort({ battleID: -1 }).limit(500)
        battles = battles.filter(battle => battle.battleData[0].KillArea === "CRYSTAL_LEAGUE")
            // console.log('battles', battles.length)

        battles.length && battles.forEach(battle => {
            // console.log(battle.battleData[0].KillArea, battle.battleData[0].startTime, new Date(battle.battleData[0].startTime).getTime())

            let battlePlayers = Object.keys(battle.battleData[0].players)

            crystals.forEach(crystal => {
                const battleTimer = new Date(battle.battleData[0].startTime).getTime()
                const crystalTimer = new Date(crystal.startTime).getTime()

                if (battleTimer > crystalTimer && battleTimer < crystalTimer + 1500000) {
                    // console.log('here', crystal.startTime, crystal.battleID)

                    let crystalPlayers = Array.from(crystal.players.map(c => c.id));
                    crystalPlayers.forEach(async p => {
                        if (battlePlayers.includes(p)) {
                            // console.log(battle.battleID)

                            await Crystal.updateOne({ matchID: crystal.matchID }, {
                                    battleID: battle.battleData[0].id,
                                })
                                .catch(err => console.log('error fail'))
                        }
                    })
                }

            })
        })

    },
    fetchData: async function() {
        let crystals = await Crystal.find({ $and: [{ 'battleID': { "$ne": null } }, { 'battleID': { "$ne": 0 } }, { 'events.0': { $exists: false } }] }).sort({ startTime: -1 }).limit(50) // battleID: 0 

        console.log('crystals', crystals.length)

        crystals.length && crystals.forEach(crystal => {
            axios.get(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${crystal.battleID}?offset=0&limit=51`)
                .then(async response => {
                    // console.log(crystal.battleID)
                    let eventCleaned = response.data

                    eventCleaned = eventCleaned.map(ev => cleanEvent.cleanEvents(ev))
                    console.log(eventCleaned, crystal.matchID)

                    await Crystal.updateOne({ matchID: crystal.matchID }, {
                        //     events: eventCleaned
                        $set: { "events": eventCleaned }
                    })
                })
                .catch(console.log('error fetch crystal 2'))
        })
    }
}