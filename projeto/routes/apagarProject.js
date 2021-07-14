const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/apagarProject", (req, res, next) => {
        const idTrabalho = req.body.idTrabalho;
        const body = JSON.stringify({ idTrabalho });
        return fetch(`http://serverapi:8080/FinalProject/trabalhos`, {
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