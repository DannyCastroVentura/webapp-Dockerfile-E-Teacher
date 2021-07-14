const fetch = require("node-fetch");

module.exports = (app) => {

    app.post("/addRecursoDigitalProfessor", (req, res, next) => {
        console.log("adicionar Aluno ao professor");
        const professorEmail = req.body.professorEmail;
        const descricao = req.body.descricao;
        const url = req.body.url;
        const body = JSON.stringify({ email: professorEmail, url, descricao });
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/recursosDigitais`, {
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
            res.status(200).send({ message: true });
        });

    });
}