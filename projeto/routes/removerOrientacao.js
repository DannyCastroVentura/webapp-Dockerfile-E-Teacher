const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/removerOrientacao", (req, res, next) => {
        const professorEmail = req.body.professorEmail;
        const idOrientacao = parseInt(req.body.idOrientacao);        
        const body = JSON.stringify({ email: professorEmail, id: idOrientacao });
        return fetch(`http://serverapi:8080/FinalProject/orientacoes`, {
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