const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarTeacherAdmin", (req, res, next) => {
        const email = req.body.email;
        const nome = req.body.nome;
        const emailNovo = req.body.emailNovo;
        let estado = req.body.estado;
        if(estado == "t"){
            estado = true;
        }else if(estado == "f"){
            estado = false;
        }
        const body = JSON.stringify({ emailNovo, nome, email, estado });       
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