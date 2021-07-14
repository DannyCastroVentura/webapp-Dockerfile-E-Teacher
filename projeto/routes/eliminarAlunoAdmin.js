const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/eliminarAlunoAdmin", (req, res, next) => {
        console.log("eliminar aluno");
        const email = req.body.email;
        console.log("email: ", email);
        const body = JSON.stringify({ email: email });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/alunos`, {
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