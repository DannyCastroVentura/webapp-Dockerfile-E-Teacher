const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/aceitarAlteracaoProjeto", (req, res, next) => {
        const idTrabalho = req.body.idTrabalho;
        const novoIdTrabalho = req.body.novoIdTrabalho;
        const versao2 = req.body.versao2;
        const body = JSON.stringify({ idTrabalho, novoIdTrabalho, versao2 });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/trabalhos`, {
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