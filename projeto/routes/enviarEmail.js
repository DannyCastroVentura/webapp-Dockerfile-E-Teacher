
//enviar email
const nodemailer = require('nodemailer');
const { pass } = require('./../config/smtp');
const SMPT_CONFIG = require('./../config/smtp');
const transporter = nodemailer.createTransport({
    host: SMPT_CONFIG.host,
    port: SMPT_CONFIG.port,
    pool: true,
    secure: false,
    auth: {
        user: SMPT_CONFIG.user,
        pass: SMPT_CONFIG.pass
    },
    tls: {
        rejectUnauthorized: false
    },
    dkim: {
        domainName: SMPT_CONFIG.host,
        keySelector: 'mail'

    }
});

module.exports = (app) => {
    app.post('/confirmacaoDeContaEmail', async (req, res) => {
        console.log("Entrou aqui");
        const email = req.body.email;
        const url = req.body.urlBase;
        const user = req.body.user;
        const password = req.body.password;

        console.log(email + " " + url + " user: " + user);
        let resposta = undefined;
        if (user == "professores") {
            //caso professores
            resposta = await transporter.sendMail({
                html: "<br><br>Thank you for registering with E-Teacher!<br/><br/>Email: " + email + "<br/><br/>Click on this <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "' >link</a> to have your account activated!<br><br><hr><br><br>Obrigado por se registrar no E-Teacher!<br/><br/>Email: " + email + "<br/><br/>Clique neste <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "' >link</a>  para ter sua conta ativada!",
                subject: 'Automatic response in the registration of your account',
                from: "E-Teacher",
                to: [email]
            });
        } else if (user == "alunos") {
            //caso alunos
            //verificar se foi o professor que adicionou ou um admin
            if (req.body.admin != undefined) {
                //foi o admin
                resposta = await transporter.sendMail({
                    html: "You have been registered to E-Teacher!<br/><br/>Email: " + email + "<br/><br/>Note that you should change this password after you click the following link!<br/>Click on this <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "' >link</a> to have your account activated!<br><br><hr><br><br>Você foi registrado no E-Teacher!<br/><br/>Email: " + email + "<br/><br/>Observe que você deverá alterar essa senha após clicar no link a seguir!<br/>Clique neste <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "' >link</a> para ter a sua conta ativada!",
                    subject: 'Automatic response in the registration of your account',
                    from: "E-Teacher",
                    to: [email]
                });
            } else {
                //foi o professor
                resposta = await transporter.sendMail({
                    html: "You have been registered to E-Teacher!<br/><br/>Email: " + email + "<br/>Password: " + password + "<br/><br/>Note that you will need to change this password after you click the following link!<br/>Click on this <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "&password=" + password + "' >link</a> to have your account activated!<br><br><hr><br><br>Você foi registrado no E-Teacher!<br/><br/>Email: " + email + "<br/>Palavra-passe: " + password + "<br/><br/>Observe que você precisará alterar essa senha após clicar no link a seguir!<br/>Clique neste <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "&password=" + password + "' >link</a> para ter a sua conta ativada!",
                    subject: 'Automatic response in the registration of your account',
                    from: "E-Teacher",
                    to: [email]
                });
            }

        }else if(user == "admin"){
            //caso admin
                resposta = await transporter.sendMail({
                    html: "You have been registered to E-Teacher!<br/><br/>Email: " + email + "<br/><br/>Note that you should change this password after you click the following link!<br/>Click on this <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "' >link</a> to have your account activated!<br><br><hr><br><br>Você foi registrado no E-Teacher!<br/><br/>Email: " + email + "<br/><br/>Observe que você deverá alterar essa senha após clicar no link a seguir!<br/>Clique neste <a href = '" + url + "/confirmEmail?email=" + email + "&urlBase=" + url + "&user=" + user + "' >link</a> para ter a sua conta ativada!",
                    subject: 'Automatic response in the registration of your account',
                    from: "E-Teacher",
                    to: [email]
                });
        }
        console.log(resposta);
        res.send(true);

    });

    app.post('/enviarEmailGeral', async (req, res) => {
        console.log("Entrou aqui");
        const Para = req.body.Para;
        const Mensagem = req.body.Mensagem;
        const Subject = req.body.Subject;

        resposta = await transporter.sendMail({
            html: Mensagem,
            subject: Subject,
            from: "E-Teacher",
            to: [Para]
        });

        console.log(resposta);
        res.send(true);

    });
}