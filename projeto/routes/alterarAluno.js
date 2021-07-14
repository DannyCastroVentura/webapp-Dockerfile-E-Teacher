const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarAluno", (req, res, next) => {
        console.log("alterar Aluno")
        const email = req.body.alunoEmail;
        const nome = req.body.alunoNome;
        const numeroDeAluno = parseInt(req.body.alunoNumero);
        const body = JSON.stringify({ email, nome, numeroDeAluno });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/alunos`, {
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