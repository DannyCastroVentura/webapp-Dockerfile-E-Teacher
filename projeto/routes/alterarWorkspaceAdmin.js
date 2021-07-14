const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarWorkspaceAdmin", (req, res, next) => {
        const id = parseInt(req.body.id);
        const cor = req.body.cor;
        const nome = req.body.nome;
        const body = JSON.stringify({ id, cor, nome });       
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/areas`, {
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