import express from 'express';
import client from './db.js';


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API je v provozu!');
});


// --- TEAM CRUD ---

app.get('/team', async(req, res) =>{
    const result = await client.query(`SELECT * FROM team`);
    res.json(result.rows);
})

app.get('/team/:id', async(req,res) => {
    const result  = await client.query(`SELECT * FROM team WHERE id = $1`,
        [req.params.id]
    );
    res.json(result.rows[0])
})

app.post('/team', async(req, res) => {
    const { name } = req.body;
    const result = await client.query(`INSERT INTO team (name) VALUES($1) RETURNING`,
        [name]
    );
    res.status(201).json(result.rows[0]);
})

app.put('/team/:id', async(req,res) => {
    const { name } = req.body;
    const result = await client.query(`UPDATE team SET name = $1 WHERE id = $2 RETURNING *`,
        [name, req.params.id]
    );
    res.json(result.rows[0])
})

app.delete('/team/:id', async(req, res) => {
    await client.query(`DELETE FROM team WHERE id = $1 RETURNING *`,
        [req.params.id]
    )
    res.status(204).send()
})


// --- MATCH CRUD ---

app.get('/match', async(req, res) => {
    const result = await client.query(`SELECT * FROM match`);
    res.json(result.rows);
});

app.get('/match/:id', async(req,res) =>{
    const result = await client.query(`SELECT * FROM match WHERE id = $1`,
        [req.params.id]
    )
    res.json(result.rows[0])
})

app.post('/match', async(req, res) => {
    const { home_team_id, guest_team_id, date } = req.body;
    const result = await client.query(`INSERT INTO match (home_team_id, guest_team_id, date) VALUES($1, $2 ,$3) RETURNING *`,
    [home_team_id, guest_team_id, date]
    );
    res.status(201).json(result.rows[0]);
});

app.put('/match/:id', async(req, res) => {
    const { home_team_id, guest_team_id, date } = req.body;
    const result = await client.query(`UPDATE match SET home_team_id = $1, guest_team_id = $2, date = $3 RETURNING *`,
        [home_team_id, guest_team_id, date]
    );
    res.json(result.rows[0]);
})

app.delete('/match/:id', async(req, res) => {
    await client.query(`DELETE FROM match WHERE id = $1 RETURNING *`, 
        [req.params.id]
    );
  res.status(204).send();
})


// --- EVENT CRUD ---

app.get('/event', async(req, res) => {
    const result = await client.query(`SELECT * FROM event`);
    res.json(result.rows);
})

app.get('/event/:id', async (req, res) => {
  const result = await client.query(`SELECT * FROM event WHERE id = $1`, 
    [req.params.id]
);
  res.json(result.rows[0]);
});

app.post('/event', async(req, res) => {
    const { match_id, team_id, type, minute } = req.body;
    const result = await client.query(`INSERT INTO event(match_id, team_id, type, minutes) VALUES($1, $2, $3, $4) RETURNING *`,
        [match_id, team_id, type, minute]
    );
    res.status(201).json(result.rows[0]);
})

app.put('/event/:id', async (req, res) => {
  const { match_id, team_id, type, minute } = req.body;
  const result = await client.query(
    `UPDATE event SET match_id = $1, team_id = $2, type = $3, minutes = $4 WHERE id = $5 RETURNING *`,
    [match_id, team_id, type, minute, req.params.id]
  );
  
  res.json(result.rows[0]);
});

app.delete('/event/:id', async (req, res) => {
  await client.query(`DELETE FROM event WHERE id = $1 RETURNING *`, 
    [req.params.id]
);
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT,()=> {
    console.log(`Server running on http://localhost:${PORT}`);
})

