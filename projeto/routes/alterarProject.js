const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarProject", (req, res, next) => {
        const idTrabalho = req.body.idTrabalho;
        const nome = req.body.nome;
        const imagem = req.body.imagem;
        const relatorio = req.body.relatorio;
        const codigo = req.body.codigo;
        const info = req.body.info;
        console.log("req.body.nota: " + req.body.nota);
        let nota = "0.00";
        if(req.body.nota !== ""){
            nota = req.body.nota;
        }
        console.log(nota);
        const resumo = req.body.resumo;        
        let versao2 = undefined;
        let body = undefined;
        if(req.body.versao2 !== undefined){
          versao2 = req.body.versao2;
          body = JSON.stringify({ idTrabalho, nome, imagem, relatorio, codigo, informacao: info, nota: nota, resumo, versao2 });
        }else{          
          body = JSON.stringify({ idTrabalho, nome, imagem, relatorio, codigo, informacao: info, nota: nota, resumo });
        }
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/trabalhos`, {
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