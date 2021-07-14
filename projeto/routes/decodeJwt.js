const jsonwebtoken = require("jsonwebtoken");
const jwtSecret = require("../config/jwt");

const bcrypt = require("bcrypt");


module.exports = (app) => {

    app.post("/decodeJwt", (req, res, next) => {
        const token = req.body.token;
        const hashedToken = req.body.hashedToken;
        bcrypt.compare(token, hashedToken).then((response) => {
            if (response != true) {
                console.log("The password does not match!");
                res.status(401).send({ info: "The password does not match!" });
                return;
            }
            jsonwebtoken.verify(token, jwtSecret.secret, (err, decoded) => {
                if (err) {
                    //jwt expirou
                    //enviar uma notificacao para dar pop up a dizer que precisa de voltar a dar login
                    res.status(409).send({ message: "Token expired!" });
                    return;
                }
                console.log(decoded);
                res.status(200).send(decoded);
            });
        });
    });
}