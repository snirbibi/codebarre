const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir le dossier public (index.html)
app.use(express.static(path.join(__dirname, "public")));

// Connexion à la base SQLite
const db = new sqlite3.Database("carrefour.db", (err) => {
    if (err) console.error("Erreur connexion SQLite :", err.message);
    else console.log("SQLite OK.");
});

// API : rechercher un article par code-barres
app.post("/api/article", (req, res) => {
    if (!req.body.codeBarre) {
        return res.json({ message: "codeBarre missing!" });
    }

    const codeBarre = req.body.codeBarre;

    db.get(
        "SELECT * FROM articles WHERE codeBarre = ?",
        [codeBarre],
        (err, row) => {
            if (err) {
                return res.json({ message: "Erreur SQLite : " + err.message });
            }

            if (!row) {
                return res.json({ message: "Aucun article trouvé." });
            }

            res.json({ message: "OK", results: row });
        }
    );
});

// Lancer le serveur
const PORT = process.env.PORT || 8080; // fallback local
//const PORT = 8080; // fallback local
app.listen(PORT, () => {
    console.log("Serveur Node.js démarré sur le port " + PORT);
});

