const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarAdminAdmin", (req, res, next) => {
        const email = req.body.email;
        const nome = req.body.nome;
        const emailNovo = req.body.emailNovo;
        const body = JSON.stringify({ emailNovo, nome, email });       
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/admin`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
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