const fetch = require("node-fetch");
module.exports = (app) => {
    
    app.post("/alterarConta", (req, res, next) => {
        const email = req.body.email;
        const params = { email: email };
        console.log(params);
        if(req.body.fotoPerfil !== undefined)
        {
            params["fotoPerfil"] = req.body.fotoPerfil;
        }
        if(req.body.fotoFundo !== undefined)
        {
            params["fotoFundo"] = req.body.fotoFundo;
        }
        if(req.body.nome !== undefined)
        {
            params["nome"] = req.body.nome;
        }
        if(req.body.exp !== undefined)
        {
            params["exp"] = parseInt(req.body.exp);
        }
        if(req.body.idArea !== undefined)
        {
            params["idArea"] = parseInt(req.body.idArea);
        }
        if(req.body.resumo !== undefined)
        {
            params["resumo"] = req.body.resumo;
        }        
        if(req.body.orcidId !== undefined)
        {
            params["orcidId"] = req.body.orcidId;
        }
        const body = JSON.stringify( params );
        console.log("chegou aqui ao alterarConta antes de mostrar o body");
        console.log(body);
        return fetch(`http://serverapi:8080/FinalProject/professores`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: body
        }).then((response) => {
            return response.json();
        }).then((response) => {
            res.send("changes done!");
        });   
      });
    }