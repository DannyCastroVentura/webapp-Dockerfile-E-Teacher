const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/removerDisciplinaCompletamente", (req, res, next) => {
        const professorEmail = req.body.professorEmail;
        const idInstituicao = parseInt(req.body.idInstituicao);
        const idDisciplina = parseInt(req.body.idDisciplina);        
        const body = JSON.stringify({ professorEmail: professorEmail, idInstituicao: idInstituicao, idDisciplina: idDisciplina });
        return fetch(`http://serverapi:8080/FinalProject/professoresDisciplinas`, {
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