const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/alterarResearchProject", (req, res, next) => {
        const id = parseInt(req.body.id);
        const titulo = req.body.titulo;
        const investigadorPrincipal = req.body.investigadorPrincipal;
        const dataInicio = req.body.dataInicio;
        const Image = req.body.Image;
        const sigla = req.body.sigla;
        const financiador = req.body.financiador;
        const link = req.body.link;
        const resumo = req.body.resumo;
        let body;
        let dataFim = 0;
        if(req.body.dataFim != ""){
            dataFim = req.body.dataFim;    
            
        }
        body = JSON.stringify({ id, titulo, investigadorPrincipal, dataInicio, imagem: Image, sigla, financiador, link, resumo, dataFim });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/projetosInvestigacao`, {
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