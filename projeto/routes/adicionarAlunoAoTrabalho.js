const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/adicionarAlunoAoTrabalho", (req, res, next) => {
        console.log("adicionar Aluno ao trabalho")
        const idTrabalho = req.body.idTrabalho;
        const alunoEmail = req.body.alunoEmail;
        const body = JSON.stringify({ idTrabalho: idTrabalho, alunoEmail: alunoEmail });
        console.log(body);
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