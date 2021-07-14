const fetch = require("node-fetch");
module.exports = (app) => {

    app.get("/confirmEmail", (req, res, next) => {
        const email = req.param('email');
        const urlBase = req.param('urlBase');
        const user = req.param('user');
        const password = req.param('password');
        const body = JSON.stringify({ email });
        if (user == "professores") {
            return fetch(`http://serverapi:8080/FinalProject/professores`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: body
            }).then((response) => {
                console.log("enviou email");
                return response.json();
            }).then((response) => {
                res.redirect(urlBase + "?contaCriada=true");
            });
        } else if (user == "alunos") {
            return fetch(`http://serverapi:8080/FinalProject/alunos`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: body
            }).then((response) => {
                console.log("enviou email");
                return response.json();
            }).then((response) => {
                if (password != undefined) {
                    res.redirect(urlBase + "?contaCriada=true&alterarPassword=true&studentEmail=" + email + "&password=" + password);
                } else {
                    res.redirect(urlBase + "?contaCriada=true");
                }
            });
        }
        else if (user == "admin") {
            return fetch(`http://serverapi:8080/FinalProject/admin`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: body
            }).then((response) => {
                console.log("enviou email");
                return response.json();
            }).then((response) => {
                res.redirect(urlBase + "?contaCriada=true");
            });
        }
    });
}