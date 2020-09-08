const Guild = require('./models/Guild')
module.exports = {
    battleTreatment : function (battle) {
        battle.succeedFetch = 0
        battle.failedFetch = 0

        for (const guild in battle.guilds) {
            if (!battle.guilds[guild].allianceId) {
                battle.alliances[guild] = battle.guilds[guild]
                battle.guilds[guild].allianceId = guild
            }
        }
        for (const alliance in battle.alliances) {
            battle.alliances[alliance].players = []
            battle.alliances[alliance].listItemPower = []
            battle.alliances[alliance].guilds = []
        }
        for (const guild in battle.guilds) {
            const allianceOfGuild = battle.alliances[battle.guilds[guild].allianceId]
            allianceOfGuild.guilds.push( battle.guilds[guild].name ) // ONLY NAME : TODO OBJECT
        } 
    
        for (const player in battle.players) {
            battle.players[player].damageDone = []
            battle.players[player].healingDone = []
            battle.players[player].assistance = 0
            battle.players[player].deathFame = []
            battle.players[player].weapon = ''
            battle.players[player].mount = ''
            battle.players[player].itempower = null
    
            if (!battle.players[player].allianceId) {
                battle.players[player].allianceId = battle.players[player].guildId
            }
        }
        return battle
    },
    battleEventDeathTreatment : function (battle, player, eventDeath) {
        if (battle.players[player.id].deathFame.length < battle.players[player.id].deaths) { // To prevent double treatment from setinterval not full battle & classical treatment
            battle.KillArea = eventDeath.KillArea

                // ------- VICTIM ITEM - IP - DEATHFAME
            battle.players[player.id].weapon = eventDeath.Victim.Equipment.MainHand && eventDeath.Victim.Equipment.MainHand.Type ? `${eventDeath.Victim.Equipment.MainHand.Type}?quality=${eventDeath.Victim.Equipment.MainHand.Quality}` : battle.players[player.id].weapon
            battle.players[player.id].mount = eventDeath.Victim.Equipment.Mount && eventDeath.Victim.Equipment.Mount.Type ?`${eventDeath.Victim.Equipment.Mount.Type}?quality=${eventDeath.Victim.Equipment.Mount.Quality}` : ''
            battle.players[player.id].itempower = eventDeath.Victim.AverageItemPower.toFixed(0) > battle.players[player.id].itempower ? eventDeath.Victim.AverageItemPower.toFixed(0) : battle.players[player.id].itempower
            battle.players[player.id].deathFame.push(eventDeath.Victim.DeathFame)
            battle.players[player.id].EventId = eventDeath.EventId
            
            // ------- KILLER ITEM - IP - DEATHFAME
            battle.players[eventDeath.Killer.Id].weapon = eventDeath.Killer.Equipment.MainHand && eventDeath.Killer.Equipment.MainHand.Type ? `${eventDeath.Killer.Equipment.MainHand.Type}?quality=${eventDeath.Killer.Equipment.MainHand.Quality}` : battle.players[eventDeath.Killer.Id].weapon
            battle.players[eventDeath.Killer.Id].mount = eventDeath.Killer.Equipment.Mount && eventDeath.Killer.Equipment.Mount.Type ? `${eventDeath.Killer.Equipment.Mount.Type}?quality=${eventDeath.Killer.Equipment.Mount.Quality}` : battle.players[eventDeath.Killer.Id].mount
            battle.players[eventDeath.Killer.Id].itempower = eventDeath.Killer.AverageItemPower.toFixed(0) > battle.players[eventDeath.Killer.Id].itempower ? eventDeath.Killer.AverageItemPower.toFixed(0) : battle.players[eventDeath.Killer.Id].itempower

            // ------- PARTICIPANT WEAPON / IP / DMG / HEAL / ASSIST
            eventDeath.Participants.forEach( participant => {
                // console.log(battle.players[participant.Id])
                if (battle.players[participant.Id]) {
                    battle.players[participant.Id].weapon = participant.Equipment.MainHand && participant.Equipment.MainHand.Type ? `${participant.Equipment.MainHand.Type}?quality=${participant.Equipment.MainHand.Quality}` : battle.players[participant.Id].weapon
                    battle.players[participant.Id].mount = participant.Equipment.Mount && participant.Equipment.Mount.Type ? `${participant.Equipment.Mount.Type}?quality=${participant.Equipment.Mount.Quality}` : battle.players[participant.Id].mount
                    battle.players[participant.Id].assistance += 1
                    battle.players[participant.Id].damageDone.push(participant.DamageDone)
                    battle.players[participant.Id].healingDone.push(participant.SupportHealingDone)
                    battle.players[participant.Id].itempower = participant.AverageItemPower.toFixed(0) > battle.players[participant.Id].itempower ? participant.AverageItemPower.toFixed(0) : battle.players[participant.Id].itempower
                }
                
            })
            eventDeath.GroupMembers.forEach( member => {
                battle.players[member.Id].weapon = member.Equipment.MainHand && member.Equipment.MainHand.Type ? `${member.Equipment.MainHand.Type}?quality=${member.Equipment.MainHand.Quality}` : ''
            }) 
        }
        return battle
    },
    async registerNewGuild (guilds, guildsIDInDB) {
        for (const currentGuildID in guilds) {
            // Not with find, because if I push the result of newGuild in guildsInDB, it might have an error cause another battle had the same guildID not in array
            let guildFound = guildsIDInDB.includes(currentGuildID)
            if (!guildFound) {
                guildsIDInDB.push(currentGuildID)
                // console.log('need to set guild', currentGuildID)
                 await new Guild({
                    guildID: currentGuildID,
                    guildName: guilds[currentGuildID].name.toUpperCase(),
                }).save()
            }
        }
    },
    crystalPlayersArray(playerObj1, playerObj2) {
        let playersID = Object.keys(playerObj1).concat(Object.keys(playerObj2))
        let players = Object.values(playerObj1).concat(Object.values(playerObj2))
        return players.map((player, i) => ({...player, id: playersID[i]}))
    }

}