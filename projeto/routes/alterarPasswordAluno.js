const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const BCRYPT_SALT_ROUNDS = 12;

module.exports = (app) => {

  app.post("/alterarPasswordAluno", (req, res, next) => {
    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    const password = req.body.password;
    fetch(`http://serverapi:8080/FinalProject/alunos`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const results = [];
        //verificar se existe algum aluno com o mesmo email e a mesma password antiga
        for (let i = 0; i < data.alunos.length; i++) {
          if (data.alunos[i]["email"] == email && data.alunos[i]["password"] == oldPassword) {
            results.push(data.alunos[i]);
          }
        }
        console.log("registar results.length: " + results.length);
        if (!results.length == 0) {
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
        } else {
          //não existe um user com esse email e password...
          res.status(404).send();
        }
      });



  });
}