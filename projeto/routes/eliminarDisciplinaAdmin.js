const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/eliminarDisciplinaAdmin", (req, res, next) => {
        console.log("eliminar disciplina")
        const id = parseInt(req.body.id);
        const body = JSON.stringify({ id: id });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/disciplinas`, {
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