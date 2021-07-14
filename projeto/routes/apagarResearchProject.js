const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/apagarResearchProject", (req, res, next) => {
        const idTrabalho = parseInt(req.body.idTrabalho);
        const professorEmail = req.body.professorEmail;
        const body = JSON.stringify({ id: idTrabalho, email: professorEmail });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/projetosInvestigacao`, {
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