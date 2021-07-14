const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/removerRecursoDigital", (req, res, next) => {
        const idRS = parseInt(req.body.idRS);        
        const body = JSON.stringify({ id: idRS });
        return fetch(`http://serverapi:8080/FinalProject/recursosDigitais`, {
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