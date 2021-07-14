const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/registarInstituicaoAdmin", (req, res, next) => {
        console.log("registar uma nova instituicao");
        const sigla = req.body.sigla;
        const nome = req.body.nome;
        const body = JSON.stringify({ sigla: sigla, nome: nome });
        console.log("Body: " + body);
        return fetch(`http://serverapi:8080/FinalProject/instituicao`, {
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