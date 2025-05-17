import pkg from 'pg';
const { Client } = pkg;


const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: '12341234',
    database: 'postgres'
})

await client.connect()


export default client;
