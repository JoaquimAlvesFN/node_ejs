const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const sqlite = require('sqlite');
const dbConnection = sqlite.open('banco.sqlite', { Promise });

app.get('/', async(req, res) => {
    const db = await dbConnection;
    const categoriasDb = await db.all('SELECT * FROM categorias;'); 
    const vagas = await db.all('SELECT * FROM vagas;');
    const categorias = categoriasDb.map(cat => {
        return {
            ...cat,
            vagas: vagas.filter(vaga => vagas.categoria === cat.id)
        }
    });
    res.render('home', {
        categorias
    });
});

app.get('/vaga', (req, res) => {
    res.render('vaga');
});

const init = async() => {
    const db = await dbConnection;
    await db.run('create table if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT)');
    await db.run('create table if not exists vagas (id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT)');
    //const categoria = 'Engeneering Team';
    //await db.run(`INSERT INTO categorias (categoria) VALUES ('${categoria}')`);
    //const vaga = 'BackEnd Developer (Remote)';
    //const descricao = 'Vaga para BackEnd Developer que fez o FullStack Lab';
    //await db.run(`INSERT INTO vagas (categoria, titulo, descricao) VALUES (2, '${vaga}', '${descricao}')`);
}
init();

app.listen(3000, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('Server Runing');
    }
});