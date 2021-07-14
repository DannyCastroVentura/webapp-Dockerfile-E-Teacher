const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const path = require('path');

app.use(express.static(path.join(__dirname, '/public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());


app.listen(3000, () => console.log("Listening in port 3000"));


//routes

require('./routes/registarUser')(app);
require('./routes/loginUser')(app);
require('./routes/enviarEmail')(app);
require('./routes/confirmEmail')(app);
require('./routes/createProject')(app);
require('./routes/createResearchProject')(app);
require('./routes/alterarProject')(app);
require('./routes/alterarResearchProject')(app);
require('./routes/aceitarAlteracaoProjeto')(app);
require('./routes/apagarProject')(app);
require('./routes/apagarResearchProject')(app);
require('./routes/alterarPasswordAluno')(app);
require('./routes/alterarPasswordUser')(app);
require('./routes/alterarPasswordEsquecida')(app);
require('./routes/adicionarAlunoAoTrabalho')(app);
require('./routes/adicionarAlunoAoProfessor')(app);
require('./routes/eliminarAlunoDoTrabalho')(app);
require('./routes/eliminarAlunoDoProfessor')(app);
require('./routes/addDisciplinaProfessor')(app);
require('./routes/addOrientacaoProfessor')(app);
require('./routes/changeOrientacaoProfessor')(app);
require('./routes/removerDisciplinaAtiva')(app);
require('./routes/removerDisciplinaCompletamente')(app);
require('./routes/removerOrientacao')(app);
require('./routes/alterarAluno')(app);
require('./routes/alterarConta')(app);
require('./routes/decodeJwt')(app);
require('./routes/getPasswordUser')(app);
require('./routes/checkPasswordUser')(app);
require('./routes/addRecursoDigitalProfessor')(app);
require('./routes/alterarRecursoDigital')(app);
require('./routes/removerRecursoDigital')(app);



//admin
require('./routes/eliminarProfessorAdmin')(app);
require('./routes/eliminarAlunoAdmin')(app);
require('./routes/eliminarAdminAdmin')(app);
require('./routes/alterarTeacherAdmin')(app);
require('./routes/alterarStudentAdmin')(app);
require('./routes/alterarAdminAdmin')(app);
require('./routes/registarInstituicaoAdmin')(app);
require('./routes/eliminarInstituicaoAdmin')(app);
require('./routes/registarDisciplinaAdmin')(app);
require('./routes/eliminarDisciplinaAdmin')(app);
require('./routes/alterarInstituicaoAdmin')(app);
require('./routes/alterarDisciplinaAdmin')(app);
require('./routes/alterarWorkspaceAdmin')(app);
require('./routes/registarWorkspaceAdmin')(app);
require('./routes/eliminarWorkspaceAdmin')(app);
require('./routes/adicionarLogNoAdmin')(app);
require('./routes/atualizarTokenAdmin')(app);



module.exports = app;