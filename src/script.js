import client from './db.js'
import { MatchDao, EventType } from "./matchDAO.js";


function randomMinute(){
    return Math.floor(Math.random() * 90) + 1;
}

async function main() {
    const dao = new MatchDao();
    const teamA = await dao.ensureTeam('AC Sparta')
    const teamB = await dao.ensureTeam('SK Slavia')
    const date = new Date()

    const matchId = await dao.createMatch(teamA, teamB, date)
    const events = [];


    for(let i = 0; i < 3; i ++) {
        const gol = Math.random()<0.5 ?teamA : teamB;
        events.push({
            matchId,
            teamId: gol,
            type: EventType.GOAL,
            minute: randomMinute(),
        });
    }

    events.push({
        matchId,
        teamId : Math.random() < 0.5 ?teamA : teamB,
        type: EventType.RED_CARD,
        minute: randomMinute(),
    })

    events.push({
        matchId,
        teamId: Math.random()< 0.5 ? teamA : teamB,
        type: EventType.YELLOW_CARD,
        minute: randomMinute(),
    })

    for(const e of events){
        await dao.addEvent(e.matchId, e.teamId, e.type, e.minute)
    }
       
     console.log('Done');
     await client.end();
    
}

main().catch(console.error);