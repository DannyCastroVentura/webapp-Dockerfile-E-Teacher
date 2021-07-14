const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const BCRYPT_SALT_ROUNDS = 12;

module.exports = (app) => {

    app.post("/alterarPasswordUser", (req, res, next) => {
        const tipo = req.body.tipo;
        const email = req.body.email;
        const oldPassword = req.body.oldPassword;
        const password = req.body.password;
        console.log(tipo);
        if (tipo === "professores") {
            fetch(`http://serverapi:8080/FinalProject/professores`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    //verificar se existe algum aluno com o mesmo email e a mesma password antiga
                    for (let i = 0; i < data.professores.length; i++) {
                        if (data.professores[i]["email"] == email) {
                            console.log("antes de verificar a palavra passe");
                            bcrypt.compare(oldPassword, data.professores[i]["password"]).then((response) => {
                                if (response != true) {
                                    console.log("The password does not match!");
                                    res.status(404).send({ info: "The password does not match!" });
                                    return;
                                }
                                console.log("encontrou");
                                //existe um aluno com esse email e essa password, pode então alterar a password
                                bcrypt
                                    .hash(password, BCRYPT_SALT_ROUNDS)
                                    .then((hashedPassword) => {
                                        const body = JSON.stringify({ email, oldPassword, password: hashedPassword });
                                        console.log(body);
                                        return fetch(`http://serverapi:8080/FinalProject/professores`, {
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
                            });
                        }

                    }
                });
        } else if (tipo === "alunos") {

            fetch(`http://serverapi:8080/FinalProject/alunos`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    //verificar se existe algum aluno com o mesmo email e a mesma password antiga
                    for (let i = 0; i < data.alunos.length; i++) {
                        if (data.alunos[i]["email"] == email) {
                            bcrypt.compare(oldPassword, data.alunos[i]["password"]).then((response) => {
                                if (response != true) {
                                    console.log("The password does not match!");
                                    res.status(404).send({ info: "The password does not match!" });
                                    return;
                                }
                                console.log("encontrou");
                                //existe um aluno com esse email e essa password, pode então alterar a password
                                bcrypt
                                    .hash(password, BCRYPT_SALT_ROUNDS)
                                    .then((hashedPassword) => {
                                        const body = JSON.stringify({ email, oldPassword, password: hashedPassword });
                                        console.log(body);
                                        return fetch(`http://serverapi:8080/FinalProject/alunos`, {
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
                            });
                        }

                    }
                });
        }



    });
}