const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BCRYPT_SALT_ROUNDS = 12;
const jwtSecret = require("./../config/jwt");
module.exports = (app) => {
    app.post("/loginUser", async (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
        const user = req.body.user;
        console.log(user);
        if (user == "professores") {
            fetch(`http://serverapi:8080/FinalProject/professores`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    data.professores = data.professores.filter((users) => {
                        return users.estado == "t";
                    });
                    let encontrou = false;
                    for (let i = 0; i < data.professores.length; i++) {
                        if (data.professores[i]["email"] == email) {
                            encontrou = true;
                            console.log("User encontrado!")
                            bcrypt.compare(password, data.professores[i]["password"]).then((response) => {
                                if (response != true) {
                                    console.log("The password does not match!");
                                    res.status(401).send({ info: "The password does not match!" });
                                    return;
                                }
                                console.log("Utilizador autenticado!");
                                const token = jwt.sign({ email: email, nome: data.professores[i]["nome"], tipo: "professor" }, jwtSecret.secret, {
                                    expiresIn: '5h' // expires in 5 hours
                                });
                                //codificarToken
                                bcrypt
                                    .hash(token, BCRYPT_SALT_ROUNDS)
                                    .then((hashedToken) => {
                                        res.status(200).send({
                                            token: token,
                                            hashedToken: hashedToken,
                                            tipo: "professores"
                                        });
                                        return;
                                    });
                            });
                        } else {
                            if (data.professores.length === i + 1) {
                                if (!encontrou)
                                    res.status(404).send({ info: "User not found!" });
                            }
                        }
                    }
                });
        }
        else if (user == "alunos") {
            fetch(`http://serverapi:8080/FinalProject/alunos`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    data.alunos = data.alunos.filter((users) => {
                        return users.estado == "t";
                    });
                    let encontrou = false;
                    for (let i = 0; i < data.alunos.length; i++) {
                        if (data.alunos[i]["email"] == email) {
                            encontrou = true;
                            console.log("User encontrado!")
                            bcrypt.compare(password, data.alunos[i]["password"]).then((response) => {
                                if (response != true) {
                                    console.log("The password does not match!");
                                    res.status(401).send({ info: "The password does not match!" });
                                    return;
                                }
                                console.log("Utilizador autenticado!");
                                const token = jwt.sign({ email: email, nome: data.alunos[i]["nome"], tipo: "aluno" }, jwtSecret.secret, {
                                    expiresIn: '5h' // expires in 5 seconds
                                });
                                //codificarToken
                                bcrypt
                                    .hash(token, BCRYPT_SALT_ROUNDS)
                                    .then((hashedToken) => {
                                        res.status(200).send({
                                            token: token,
                                            hashedToken: hashedToken,
                                            tipo: "alunos"
                                        });
                                        return;
                                    });
                            });
                        } else {
                            if (data.alunos.length === i + 1) {
                                if (!encontrou)
                                    res.status(404).send({ info: "User not found!" });
                            }
                        }
                    }
                });
        }
        else if (user == "admin") {
            fetch(`http://serverapi:8080/FinalProject/admin`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let encontrou = false;
                    for (let i = 0; i < data.admin.length; i++) {
                        if (data.admin[i]["email"] == email) {
                            encontrou = true;
                            console.log("User encontrado!")
                            bcrypt.compare(password, data.admin[i]["password"]).then((response) => {
                                if (response != true) {
                                    console.log("The password does not match!");
                                    res.status(401).send({ info: "The password does not match!" });
                                    return;
                                }
                                console.log("Utilizador autenticado!");
                                const token = jwt.sign({ email: email, nome: data.admin[i]["nome"], tipo: "admin" }, jwtSecret.secret, {
                                    expiresIn: '5h' // expires in 5 seconds
                                });
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
                            });
                        } else {
                            if (data.admin.length === i + 1) {
                                if (!encontrou)
                                    res.status(404).send({ info: "User not found!" });
                            }
                        }
                    }
                });
        }
    });
}