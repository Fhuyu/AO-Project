module.exports = {
    battleTreatment : function (battle) {
        for (const guild in battle.guilds) {
            if (!battle.guilds[guild].allianceId) {
                battle.alliances[guild] = battle.guilds[guild]
                battle.guilds[guild].allianceId = guild
            }
        }
        // IN FRONT ?
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
    battleEventDeathTreatment : function (battle) {
        }

}