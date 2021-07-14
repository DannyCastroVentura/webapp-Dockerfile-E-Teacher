const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarInstituicaoAdmin", (req, res, next) => {
        const id = parseInt(req.body.id);
        const sigla = req.body.sigla;
        const nome = req.body.nome;
        const body = JSON.stringify({ id, sigla, nome });       
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/instituicao`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: body
        }).then((response) => {
          console.log("a verificar se tem erro...");
          return response.json();
        }).then((response) => {
          console.log(response);
          res.status(200).send({ message: true });
        });
    });
}