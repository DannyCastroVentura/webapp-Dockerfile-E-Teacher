const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarRecursoDigital", (req, res, next) => {
        const id = parseInt(req.body.id);
        const descricao = req.body.descricao;
        const url = req.body.url;
        const body = JSON.stringify({ id, descricao, url });    
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/recursosDigitais`, {
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