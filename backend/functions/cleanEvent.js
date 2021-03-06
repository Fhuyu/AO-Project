module.exports = {
    cleanEvents : function (event) {
        return {
            TimeStamp : event.TimeStamp,
            Killer : {
                Name : event.Killer.Name,
                Id : event.Killer.Id,
                GuildName : event.Killer.GuildName,
                GuildId : event.Killer.GuildId,
                AllianceName : event.Killer.AllianceName,
                AllianceId : event.Killer.AllianceId,
                AllianceTag : event.Killer.AllianceTag,
                KillFame : event.Killer.KillFame,
                Itempower : event.Killer.AverageItemPower,
                MainHand : event.Killer.Equipment.MainHand && `${event.Killer.Equipment.MainHand.Type}?quality=${event.Killer.Equipment.MainHand.Quality}`,
                OffHand : event.Killer.Equipment.OffHand ? `${event.Killer.Equipment.OffHand.Type}?quality=${event.Killer.Equipment.OffHand.Quality}` : null,
                Head : event.Killer.Equipment.Head && `${event.Killer.Equipment.Head.Type}?quality=${event.Killer.Equipment.Head.Quality}`,
                Armor : event.Killer.Equipment.Armor && `${event.Killer.Equipment.Armor.Type}?quality=${event.Killer.Equipment.Armor.Quality}`,
                Shoes : event.Killer.Equipment.Shoes && `${event.Killer.Equipment.Shoes.Type}?quality=${event.Killer.Equipment.Shoes.Quality}`,
                Cape : event.Killer.Equipment.MainHand && `${event.Killer.Equipment.Cape.Type}?quality=${event.Killer.Equipment.Cape.Cape}`,
                Potion : event.Killer.Equipment.Potion ? event.Killer.Equipment.Potion.Type: null,
            },
            Victim : {
                Name : event.Victim.Name,
                Id : event.Victim.Id,
                GuildName : event.Victim.GuildName,
                GuildId : event.Victim.GuildId,
                AllianceName : event.Victim.AllianceName,
                AllianceId : event.Victim.AllianceId,
                AllianceTag : event.Victim.AllianceTag,
                DeathFame : event.Victim.DeathFame,
                Itempower : event.Victim.AverageItemPower,
                MainHand : event.Victim.Equipment.MainHand && `${event.Victim.Equipment.MainHand.Type}?quality=${event.Victim.Equipment.MainHand.Quality}`,
                OffHand : event.Victim.Equipment.OffHand ? `${event.Victim.Equipment.OffHand.Type}?quality=${event.Victim.Equipment.OffHand.Quality}` : null,
                Head : event.Victim.Equipment.Head && `${event.Victim.Equipment.Head.Type}?quality=${event.Victim.Equipment.Head.Quality}`,
                Armor : event.Victim.Equipment.Armor && `${event.Victim.Equipment.Armor.Type}?quality=${event.Victim.Equipment.Armor.Quality}`,
                Shoes : event.Victim.Equipment.Shoes && `${event.Victim.Equipment.Shoes.Type}?quality=${event.Victim.Equipment.Shoes.Quality}`,
                Cape : event.Victim.Equipment.Cape && `${event.Victim.Equipment.Cape.Type}?quality=${event.Victim.Equipment.Cape.Cape}`,
                Potion : event.Victim.Equipment.Potion ? event.Victim.Equipment.Potion.Type : null,
            },
            Participants : event.Participants.map( Participant => (
                {
                    Name : Participant.Name,
                    Id : Participant.Id,
                    GuildName : Participant.GuildName,
                    GuildId : Participant.GuildId,
                    AllianceName : Participant.AllianceName,
                    AllianceId : Participant.AllianceId,
                    AllianceTag : Participant.AllianceTag,
                    DeathFame : Participant.DeathFame,
                    Itempower : Participant.AverageItemPower,
                    MainHand : Participant.Equipment.MainHand && (`${Participant.Equipment.MainHand.Type}?quality=${Participant.Equipment.MainHand.Quality}`),
                    OffHand : Participant.Equipment.OffHand && (`${ Participant.Equipment.OffHand.Type}?quality=${Participant.Equipment.OffHand.Quality}`),
                    Head : Participant.Equipment.Head && (`${Participant.Equipment.Head.Type}?quality=${Participant.Equipment.Head.Quality}`),
                    Armor : Participant.Equipment.Armor && (`${Participant.Equipment.Armor.Type}?quality=${Participant.Equipment.Armor.Quality}`),
                    Shoes : Participant.Equipment.Shoes && (`${Participant.Equipment.Shoes.Type}?quality=${Participant.Equipment.Shoes.Quality}`),
                    Cape : Participant.Equipment.Cape && (`${Participant.Equipment.Cape.Type}?quality=${Participant.Equipment.Cape.Quality}`),
                    Potion : Participant.Equipment.Potion && (Participant.Equipment.Potion.Type),
                }
            )), 
        }
    }
}