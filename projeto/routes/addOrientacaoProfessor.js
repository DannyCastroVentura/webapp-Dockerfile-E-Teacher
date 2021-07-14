const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/addOrientacaoProfessor", (req, res, next) => {
        console.log("adicionar orientacao ao professor");
        const professorEmail = req.body.professorEmail;
        const idInstituicao = parseInt(req.body.idInstituicao);
        let titulo = req.body.titulo;
        if(titulo === "true")
        {
            titulo = true;
        }else{
            titulo = false;
        }
        const nomeCurso = req.body.nomeCurso;
        const tema = req.body.tema;
        const relatorio = req.body.relatorio;
        const link = req.body.link;
        const alunoEmail = req.body.alunoEmail;
        const dataInicio = parseInt(req.body.dataInicio);
        let body;
        if(req.body.dataFim !== undefined){
            const dataFim = parseInt(req.body.dataFim);
            body = JSON.stringify({ email: professorEmail, titulo, alunoEmail, idInstituicao, dataInicio, nomeCurso, tema, relatorio, link, dataFim });
        }else{            
            body = JSON.stringify({ email: professorEmail, titulo, alunoEmail, idInstituicao, dataInicio, nomeCurso, tema, relatorio, link });
        }
        console.log("Body: " + body);
        return fetch(`http://serverapi:8080/FinalProject/orientacoes`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: body
        }).then((response) => {
            console.log("a verificar se tem erro...");
            return response.json();


        }).then((response) => {
            if (response.info === "Professor j� orientando esse mesmo aluno nessa mesma faculdade com o mesmo tipo!") {
                res.status(409).send({ message: true });
            } else {
                res.status(200).send({ message: true });
            }

        });

    });
}