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
        const { id, nama, nim, kelas } = req.body;

        const result = await pool.query(
            'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, nama, nim, kelas]
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

//put
app.put('/biodata/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, umur, alamat } = req.body;

        const result = await pool.query(
            `UPDATE biodata
            SET nama = $1,
                umur = $2,
                alamat = $3
            WHERE id = $4
            RETURNING *`,
            [nama, umur, alamat, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Data tidak ditemukan"
            });
        }

        res.status(200).json({
            message: "Data berhasil diperbarui",
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);

        res.status(500).json({
            error: "Gagal mengupdate data"
        });
    }
});
//delete
app.delete('/biodata/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM biodata WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Data tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Data berhasil dihapus',
            data: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: 'Gagal menghapus data'
        });
    }
});
