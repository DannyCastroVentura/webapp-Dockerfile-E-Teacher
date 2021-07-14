const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/eliminarInstituicaoAdmin", (req, res, next) => {
        console.log("eliminar instituicao")
        const id = parseInt(req.body.id);
        const body = JSON.stringify({ id: id });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/instituicao`, {
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