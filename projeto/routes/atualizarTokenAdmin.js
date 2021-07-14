const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BCRYPT_SALT_ROUNDS = 12;
const jwtSecret = require("./../config/jwt");
module.exports = (app) => {
    app.post("/atualizarTokenAdmin", async (req, res, next) => {
        console.log("chegou aqui ao atualizarTokenAdmin");
        const emailNovo = req.body.emailNovo;
        console.log("emailNovo: " + emailNovo);
        fetch(`http://serverapi:8080/FinalProject/admin`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let encontrou = false;
                for (let i = 0; i < data.admin.length; i++) {
                    if (data.admin[i]["email"] == emailNovo) {
                        encontrou = true;
                        console.log("User encontrado!");
                        const token = jwt.sign({ email: emailNovo, nome: data.admin[i]["nome"], tipo: "admin" }, jwtSecret.secret, {
                            expiresIn: '5h' // expires in 5 seconds
                        });
                        console.log(token);
                        //codificarToken
                        bcrypt
                            .hash(token, BCRYPT_SALT_ROUNDS)
                            .then((hashedToken) => {
                                res.status(200).send({
                                    token: token,
                                    hashedToken: hashedToken,
                                    tipo: "admin"
                                });
                                return;
                            });
                            
                    } else {
                        if (data.admin.length === i + 1) {
                            if (!encontrou)
                                res.status(404).send({ info: "User not found!" });
                        }
                    }
                }
            });

    });
}