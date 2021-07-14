const fetch = require("node-fetch");
const { pass } = require("../config/smtp");

module.exports = (app) => {

    app.post("/checkPasswordUser", (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const tipo = req.body.tipo;
        return fetch(`http://serverapi:8080/FinalProject/` + tipo + `/` + email + `/password`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET"
        }).then((response) => {
            console.log("a verificar se tem erro...");
            return response.json();
        }).then((response) => {
            console.log(response);
            if (password == response.password) {
                res.status(200).send({ response: "certo" });
            } else {
                res.status(404).send({ response: "errado" });
            }
        });
    });
}