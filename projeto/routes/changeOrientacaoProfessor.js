const fetch = require("node-fetch");

module.exports = (app) => {
    app.post("/changeOrientacaoProfessor", (req, res, next) => {
        console.log("change orientacao ao professor");
        const professorEmail = req.body.professorEmail;
        const idOrientacao = parseInt(req.body.idOrientacao);
        const nomeCurso = req.body.nomeCurso;
        let title = req.body.title;
        if (title == "t") {
            title = true;
        } else {
            title = false;
        }
        const tema = req.body.tema;
        const relatorio = req.body.relatorio;
        const link = req.body.link;
        const instituicao = parseInt(req.body.instituicao);
        const dataInicio = parseInt(req.body.dataInicio);
        let dataFim = 0;
        let body;
        if (req.body.dataFim != "") {
            dataFim = parseInt(req.body.dataFim);
        }
        body = JSON.stringify({ email: professorEmail, id: idOrientacao, nomeCurso, tema, relatorio, link, titulo: title, idInstituicao: instituicao, dataInicio, dataFim });
        console.log("Body: " + body);
        return fetch(`http://serverapi:8080/FinalProject/orientacoes`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: body
        }).then((response) => {
            console.log("a verificar se tem erro...");
            return response.json();
        }).then(() => {
            res.status(200).send({ message: true });
        });

    });
}