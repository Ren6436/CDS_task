import client from './db.js'

const EventType = {
    GOAL: 1,
    YELLOW_CARD: 2,
    RED_CARD: 3,
};

class MatchDao {
    async ensureTeam(name) {
        const res = await client.query(`SELECT id FROM team WHERE name=$1`, [name]);
        if (res.rows.length > 0) {
            return res.rows[0].id
        } else {
            const insert = await client.query(
                `INSERT INTO team (name) VALUES($1) RETURNING id`,
                [name]
            );
            return insert.rows[0].id
        }
    }

    async createMatch(homeTeamId, guestTeamId, date) {
        const res = await client.query(
            `INSERT INTO match (home_team_id, guest_team_id, date) VALUES($1,$2,$3) RETURNING id`,
            [homeTeamId, guestTeamId, date]
        );
        return res.rows[0].id;
    }

    async addEvent(matchId, teamId, type, minute) {
        await client.query(
            `INSERT INTO event(match_id,team_id, type, minutes) VALUES ($1,$2,$3,$4)`,
            [matchId, teamId, type, minute]
        );
    }
}

export { MatchDao, EventType }