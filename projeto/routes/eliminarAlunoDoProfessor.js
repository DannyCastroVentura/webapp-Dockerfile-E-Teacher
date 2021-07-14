const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/eliminarAlunoDoProfessor", (req, res, next) => {
        console.log("eliminar Aluno do professor")
        const professorEmail = req.body.professorEmail;
        const alunoEmail = req.body.alunoEmail;
        const body = JSON.stringify({ professorEmail: professorEmail, alunoEmail: alunoEmail });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/professoresAlunos`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "DELETE",
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