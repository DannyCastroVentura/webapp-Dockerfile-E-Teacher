const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/createResearchProject", (req, res, next) => {
        const email = req.body.professorEmail;
        const titulo = req.body.titulo;
        const sigla = req.body.sigla;
        const investigadorPrincipal = req.body.investigadorPrincipal;
        const financiador = req.body.financiador;
        const dataInicio = parseInt(req.body.dataInicio);
        let body;
        if(req.body.dataFim != undefined){
            const dataFim = parseInt(req.body.dataFim);
            body = JSON.stringify({ email, titulo, sigla, investigadorPrincipal, financiador, dataInicio, dataFim });
        }else{
            body = JSON.stringify({ email, titulo, sigla, investigadorPrincipal, financiador, dataInicio });
        }
        
        return fetch(`http://serverapi:8080/FinalProject/projetosInvestigacao`, {
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
}