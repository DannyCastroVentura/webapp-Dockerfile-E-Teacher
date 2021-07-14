const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const BCRYPT_SALT_ROUNDS = 12;

module.exports = (app) => {

    app.post("/alterarPasswordEsquecida", (req, res, next) => {
        const tipo = req.body.tipo;
        const email = req.body.email;
        const password = req.body.password;
        console.log(tipo);
        if (tipo === "professores") {
            fetch(`http://serverapi:8080/FinalProject/professores`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    for (let i = 0; i < data.professores.length; i++) {
                        if (data.professores[i]["email"] == email) {
                            bcrypt
                                .hash(password, BCRYPT_SALT_ROUNDS)
                                .then((hashedPassword) => {
                                    const body = JSON.stringify({ email, password: hashedPassword });
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

                        }

                    }
                });
        } else if (tipo === "alunos") {

            fetch(`http://serverapi:8080/FinalProject/alunos`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    for (let i = 0; i < data.alunos.length; i++) {
                        if (data.alunos[i]["email"] == email) {
                            bcrypt
                                .hash(password, BCRYPT_SALT_ROUNDS)
                                .then((hashedPassword) => {
                                    const body = JSON.stringify({ email, password: hashedPassword });
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

                        }

                    }
                });
        } else if (tipo === "admin") {

            fetch(`http://serverapi:8080/FinalProject/admin`)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    for (let i = 0; i < data.admin.length; i++) {
                        if (data.admin[i]["email"] == email) {
                            bcrypt
                                .hash(password, BCRYPT_SALT_ROUNDS)
                                .then((hashedPassword) => {
                                    const body = JSON.stringify({ email, password: hashedPassword });
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

                    }
                });
        }



    });
}