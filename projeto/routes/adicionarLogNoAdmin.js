const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/adicionarLogNoAdmin", (req, res, next) => {
        console.log("adicionar log ao admin");
        const tipoDeAlteracao = req.body.tipoDeAlteracao;
        const tabela = req.body.tabela;
        const idRegisto = req.body.idRegisto;
        const estadoFinal = req.body.estadoFinal;
        const email = req.body.email;
        const body = JSON.stringify({ email: email, estadoFinal: estadoFinal, estadoFinal: estadoFinal, idRegisto: idRegisto, tabela: tabela, tipoDeAlteracao: tipoDeAlteracao });
        console.log("Body: " + body);
        return fetch(`http://serverapi:8080/FinalProject/logsAdmin`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: body
        }).then((response) => {
            console.log("a verificar se tem erro...");
            return response.json();


        }).then((response) => {
            if (response.info === "Disciplina j� pertencente a esse professor nessa mesma instituicao!") {
                res.status(409).send({ message: true });
            } else {
                res.status(200).send({ message: true });
            }

        });

    });
}