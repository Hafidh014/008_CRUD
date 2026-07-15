const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '12345678',
    port: 5432,
});


app.use(express.json());

app.get('/biodata', async (req, res) => {
    try {

        const result = await pool.query('SELECT * FROM biodata');
        

        res.status(200).json({
            message: "Berhasil mengambil data biodata",
            data: result.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server atau database" });
    }
});


app.listen(port, () => {
    console.log(`app running di http://localhost:${port}`);
});

//post
app.post('/biodata', async (req, res) => {
    try {
        const { nama, umur, alamat } = req.body;

        const result = await pool.query(
            'INSERT INTO biodata (nama, umur, alamat) VALUES ($1, $2, $3) RETURNING *',
            [nama, umur, alamat]
        );

        res.status(201).json({
            message: 'Data berhasil ditambahkan',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: 'Gagal menambahkan data'
        });
    }
});
