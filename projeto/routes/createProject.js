const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/createProject", (req, res, next) => {
        const idTrabalho = req.body.idTrabalho;
        const nome = req.body.nome;
        const resumo = req.body.resumo;
        const ano = req.body.ano;
        const professorEmail = req.body.professorEmail;
        const body = JSON.stringify({ idTrabalho, nome, resumo, ano, professorEmail });
        return fetch(`http://serverapi:8080/FinalProject/trabalhos`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
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