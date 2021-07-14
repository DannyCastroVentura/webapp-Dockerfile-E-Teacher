const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const BCRYPT_SALT_ROUNDS = 12;

module.exports = (app) => {

  app.post("/registarUser", (req, res, next) => {
    const email = req.body.email;
    const nome = req.body.nome;
    const password = req.body.password;
    const user = req.body.user;
    if (user == "professores") {
      fetch(`http://serverapi:8080/FinalProject/professores`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const results = [];
          const searchField = "email";
          const searchVal = email;
          for (let i = 0; i < data.professores.length; i++) {
            if (data.professores[i][searchField] == searchVal) {
              results.push(data.professores[i]);
            }
          }
          console.log("registar results.length: " + results.length);
          if (results.length == 0) {
            //nao existe nenhum user com esse email, então pode registar
            bcrypt
              .hash(password, BCRYPT_SALT_ROUNDS)
              .then((hashedPassword) => {
                const body = JSON.stringify({ email, nome, password: hashedPassword });
                return fetch(`http://serverapi:8080/FinalProject/professores`, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                  body: body
                }).then((response) => {
                  console.log("a verificar se tem erro...");
                  return response.json();
                }).then((response) => {
                  console.log(response);
                  res.status(200).send({ message: true });
                });
              });
          } else {
            //existe um user com esse email...
            res.status(409).send();
          }
        });
    } else if (user == "alunos") {
      const studentNumber = parseInt(req.body.studentNumber);
      fetch(`http://serverapi:8080/FinalProject/alunos`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const results = [];
          //verificar se existe algum aluno com o mesmo email
          let searchField = "email";
          let searchVal = email;
          for (let i = 0; i < data.alunos.length; i++) {
            if (data.alunos[i][searchField] == searchVal) {
              results.push(data.alunos[i]);
            }
          }
          //verificar se existe algum aluno com o mesmo numero de aluno
          searchField = "numeroDeAluno";
          searchVal = studentNumber;
          for (let i = 0; i < data.alunos.length; i++) {
            if (data.alunos[i][searchField] == searchVal) {
              results.push(data.alunos[i]);
            }
          }
          console.log("registar results.length: " + results.length);
          if (results.length == 0) {
            //nao existe nenhum user com esse email ou numero de aluno, então pode registar

            //verificar se foi o admin que criou ou foi um professor
            if (req.body.admin !== undefined) {
              bcrypt
                .hash(password, BCRYPT_SALT_ROUNDS)
                .then((hashedPassword) => {
                  const body = JSON.stringify({ email, nome, numeroDeAluno: studentNumber, password: hashedPassword });
                  console.log(body);
                  return fetch(`http://serverapi:8080/FinalProject/alunos`, {
                    headers: {
                      "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: body
                  }).then((response) => {
                    console.log("a verificar se tem erro...");
                    return response.json();
                  }).then((response) => {
                    console.log(response);
                    res.status(200).send({ message: true });
                  });
                });
            } else {
              const body = JSON.stringify({ email, nome, numeroDeAluno: studentNumber, password: password });
              console.log(body);
              return fetch(`http://serverapi:8080/FinalProject/alunos`, {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: body
              }).then((response) => {
                console.log("a verificar se tem erro...");
                return response.json();
              }).then((response) => {
                console.log(response);
                res.status(200).send({ message: true });
              });
            }
          } else {
            //existe um user com esse email ou numero de aluno...
            res.status(409).send();
          }
        });
    }else if (user == "admin") {
      fetch(`http://serverapi:8080/FinalProject/admin`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const results = [];
          const searchField = "email";
          const searchVal = email;
          for (let i = 0; i < data.admin.length; i++) {
            if (data.admin[i][searchField] == searchVal) {
              results.push(data.admin[i]);
            }
          }
          console.log("registar results.length: " + results.length);
          if (results.length == 0) {
            //nao existe nenhum user com esse email, então pode registar
            bcrypt
              .hash(password, BCRYPT_SALT_ROUNDS)
              .then((hashedPassword) => {
                const body = JSON.stringify({ email, nome, password: hashedPassword });
                return fetch(`http://serverapi:8080/FinalProject/admin`, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                  body: body
                }).then((response) => {
                  console.log("a verificar se tem erro...");
                  return response.json();
                }).then((response) => {
                  console.log(response);
                  res.status(200).send({ message: true });
                });
              });
          } else {
            //existe um user com esse email...
            res.status(409).send();
          }
        });
    } 



  });
}