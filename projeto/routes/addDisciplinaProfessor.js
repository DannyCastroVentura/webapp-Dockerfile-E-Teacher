const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/addDisciplinaProfessor", (req, res, next) => {
        console.log("adicionar disciplina ao professor");
        const professorEmail = req.body.professorEmail;
        const idDisciplina = parseInt(req.body.idDisciplina);
        const idInstituicao = parseInt(req.body.idInstituicao);
        const semestre = parseInt(req.body.semestre);
        const body = JSON.stringify({ professorEmail: professorEmail, idDisciplina: idDisciplina, idInstituicao: idInstituicao, semestre: semestre });
        console.log("Body: " + body);
        return fetch(`http://serverapi:8080/FinalProject/professoresDisciplinas`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: body
        }).then((response) => {
            console.log("a verificar se tem erro...");
            return response.json();


        }).then((response) => {
            if (response.info === "Disciplina j� pertencente a esse professor nessa mesma instituicao!") {
                res.status(409).send({ message: true });
            } else {
                res.status(200).send({ message: true });
            }

        });

    });
}