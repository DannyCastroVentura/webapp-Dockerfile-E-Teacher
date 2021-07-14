const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/eliminarProfessorAdmin", (req, res, next) => {
        console.log("eliminar professor")
        const professorEmail = req.body.email;
        const body = JSON.stringify({ email: professorEmail });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/professores`, {
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