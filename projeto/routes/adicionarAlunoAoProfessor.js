const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/adicionarAlunoAoProfessor", (req, res, next) => {
        console.log("adicionar Aluno ao professor");
        const emailProfessor = req.body.emailProfessor;
        const numeroALuno = req.body.numeroALuno;
        const body = JSON.stringify({ professorEmail: emailProfessor, alunoNumero: numeroALuno });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/professoresAlunos`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: body
        }).then((response) => {
            console.log("a verificar se tem erro...");
            return response.json();
            
          
        }).then((response) => {
          console.log(response.info);
          if(response.info === "N�o existe nenhum aluno com esse email!"){
            res.status(404).send({ message: true });
          }else if(response.info === "Aluno j� pertencente a esse professor"){
            res.status(409).send({ message: true });
          }else{
            res.status(200).send({ message: true });
          }
          
        });

    });
}