const express = require('express');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'challengenode',
});

const app = express();

app.get('/', async (request, response) => {
    connection.connect();
    connection.query('CREATE TABLE IF NOT EXISTS people(id int auto_increment primary key, name varchar(255) not null)');
    connection.query(`INSERT INTO people(name) VALUES('${(Math.random() + 1).toString(36).substring(7)}')`);
    const result = await getNames();
    connection.end();

    let listNames = '<ul>';

    Object.keys(result).forEach((key) => {
        const row = result[key];

        listNames += `
            <li>${row.name}</li>
        `;
    });

    listNames += '</ul>';

    console.log(listNames);

    response.send(`<h1>Full Cycle Rocks!</h1>\n${listNames}`);
});

function getNames() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT name FROM people', (error, result) => {
            if (error) throw error;

            return resolve(JSON.parse(JSON.stringify(result)));
        })
    });
}

app.listen(3333, () => console.log("Server is running!"));