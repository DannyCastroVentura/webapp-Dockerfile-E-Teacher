const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/getPasswordUser", (req, res, next) => {
        const email = req.body.email;
        const tipo = req.body.tipo;
        console.log("email:", email);
        console.log("tipo:", tipo);
        return fetch(`http://serverapi:8080/FinalProject/` + tipo + `/` + email + `/password` , {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET"
        }).then((response) => {
          console.log("a verificar se tem erro...");
          return response.json();
        }).then((response) => {
          console.log(response);
          res.status(200).send({ response });
        });
    });
}