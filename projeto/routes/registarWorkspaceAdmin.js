const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/registarWorkspaceAdmin", (req, res, next) => {
        console.log("registar uma nova disciplina");
        const cor = req.body.cor;
        const nome = req.body.nome;
        const body = JSON.stringify({ cor: cor, nome: nome });
        console.log("Body: " + body);
        return fetch(`http://serverapi:8080/FinalProject/areas`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: body
        }).then((response) => {
            console.log("a verificar se tem erro...");
            return response.json();
        }).then((response) => {
            res.status(200).send({ message: true });
        });

    });
}