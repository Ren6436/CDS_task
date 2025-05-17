import client from './db.js'
import express from 'express';


async function ensureTeam(name) {
    const res = await client.query(`SELECT id FROM team WHERE name=$1`,[name]);
    if (res.rows.length > 0 ) {
       return res.rows[0].id
    } else {
        const insert = await client.query(
            `INSERT INTO team (name) VALUES($1) RETURNING id`,
            [name]
        );
        return insert.rows[0].id
    }
}

function randomMinute(){
    return Math.floor(Math.random() * 90) + 1;
}

async function main() {
    const teamA = await ensureTeam('AC Sparta')
    const teamB = await ensureTeam('SK Slavia')
    const dates = new Date()
    const events = [];

    const matchRes = await client.query(
        `INSERT INTO match (home_team_id, guest_team_id, date) VALUES($1,$2,$3) RETURNING id`,
    [teamA, teamB, dates]
    );
    const matchId = matchRes.rows[0].id;

    for(let i = 0; i < 3; i ++) {
        const gol = Math.random()<0.5 ?teamA : teamB;
        events.push({
            matchId,
            teamId: gol,
            type: 1,
            minute: randomMinute(),
        });
    }

    events.push({
        matchId,
        teamId : Math.random() < 0.5 ?teamA : teamB,
        type: 2,
        minute: randomMinute(),
    })

    events.push({
        matchId,
        teamId: Math.random()< 0.5 ? teamA : teamB,
        type: 3,
        minute: randomMinute(),
    })

    for( const e of events){
        await client.query(
            `INSERT INTO event(match_id,team_id, type, minutes) VALUES ($1,$2,$3,$4)`,
            [e.matchId, e.teamId,e.type, e.minute]
        );
    }
     console.log('Done');
     await client.end();
    
}

main().catch(console.error);