const fetch = require("node-fetch");
const fs = require('fs');

async function getVersion() {
    return fetch(
        "https://ddragon.leagueoflegends.com/api/versions.json"
    ).then(res => res.json())
        .then(data => {
            return data[0];
        })
        .catch(error => console.log(error));
}

async function getEncryptedSummonerID(region, summonerName) {
    return fetch(
        `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
        {
            headers: {
                "X-Riot-Token": process.env.RIOT_TOKEN,
            },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => console.log(error));
}

async function getStats(region, encryptedSummonerID, queue) {
    return fetch(
        `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerID}`,
        {
            headers: {
                "X-Riot-Token": process.env.RIOT_TOKEN,
            },
        }
    )
        .then((response) => response.json())
        .then((data) => {
            for (var key in data) {
                //console.log(data);
                if (queue === "solo/duo") {
                    if (data[key].queueType === "RANKED_SOLO_5x5") {
                        return data[key];
                    }
                } else if (queue === "flex") {
                    if (data[key].queueType === "RANKED_FLEX_SR") {
                        return data[key];
                    }
                }
            }
        })
        .catch((error) => console.log(error));
}

async function scrapper(region, summonerName, queue) {
    const patch = await getVersion();
    var summoner = await getEncryptedSummonerID(region, summonerName);
    if (summoner.status) {
        let stat = {};
        stat.exists = false;
        return stat;
    }
    stat = await getStats(region, summoner.id, queue);
    if (!stat) {
        stat = [];
        stat.summonerName = summoner.name;
        stat.profileIcon = `http://ddragon.leagueoflegends.com/cdn/${patch}/img/profileicon/${summoner.profileIconId}.png`;
        stat.tier = "Unranked";
        stat.rank = "0";
        stat.leaguePoints = "0";
        stat.winrate = "0";
        stat.wins = "0";
        stat.losses = "0";
        stat.opgg = `https://euw.op.gg/summoners/euw/${summoner.name.replace(/ /g, "%20")}`;
        return stat;
    }
    stat.summonerName = summoner.name;
    stat.profileIcon = `http://ddragon.leagueoflegends.com/cdn/${patch}/img/profileicon/${summoner.profileIconId}.png`;
    stat.winrate = (stat.wins / (stat.losses + stat.wins) * 100).toFixed(2);
    stat.opgg = `https://euw.op.gg/summoners/euw/${summoner.name.replace(/ /g, "%20")}`;
    for (var key in stat) {
        stat[key] = stat[key].toString();
    }
    return stat;
}

module.exports = { scrapper };