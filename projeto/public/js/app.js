(() => {
    'use strict';

    const locationHost = location.host.split(":");
    sessionStorage.setItem("E-Teacher Location Host", locationHost[0]);
    console.log(sessionStorage.getItem("E-Teacher Location Host"));

    let fetching = false;

    angular.module('UsersApp', [])
        .controller('SearchUsersController', SearchUsersController)
        .controller('ProfileController', ProfileController)
        .controller('TrabalhosController', TrabalhosController)
        .service('AllUsersService', AllUsersService)
        .service('AllDisciplinasService', AllDisciplinasService)
        .service('AllStudentsOfTeachersService', AllStudentsOfTeachersService)
        .service('AllInstituicoesService', AllInstituicoesService)
        .service('AllAreasService', AllAreasService)
        .service('AllTrabalhosService', AllTrabalhosService)
        .service('AllOrientacoesService', AllOrientacoesService)
        .service('AllRecursosDigitaisService', AllRecursosDigitaisService)
        .service('AllLogsService', AllLogsService)
        .constant('ApiBasePath', "http://localhost:8080/FinalProject")
        .directive('loading', ['$http', function ($http) {
            return {
                restrict: 'A',
                template: '<div class="loading-spiner" style = "position: fixed;z-index:99; left: 50%;top: 50%; transform: translate(-50%, -50%);background-color: black;width: 1000%;height: 100%;opacity: 0.8;">' +
                    '<img style = "position: fixed;z-index:1000; left: 50%;top: 50%; transform: translate(-50%, -50%);" src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" /> </div>',
                link: function (scope, elm, attrs) {
                    scope.isLoading = function () {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function (v) {
                        if (v) {
                            elm.show();
                        } else {
                            elm.hide();
                        }
                    });
                }
            };
        }])

    SearchUsersController.$inject = ['AllUsersService', '$scope'];
    function SearchUsersController(AllUsersService, $scope) {
        const searchUsers = this;
        fetching = true;
        let promise = AllUsersService.getAllUsers("professores");
        promise.then((response) => {
            searchUsers.users = response.data.professores.filter((users) => {
                return users.estado == "t";
            });
            searchUsers.numero = Object.keys(searchUsers.users).length;
        }).catch((error) => {
            console.log("Something went terribly wrong: ", error);
        }).finally(() => {
            fetching = false;
        });

        searchUsers.reload = () => {
            setTimeout(() => {
                promise = AllUsersService.getAllUsers("professores");
                promise.then((response) => {
                    searchUsers.users = response.data.professores.filter((users) => {
                        return users.estado == "t";
                    });
                    searchUsers.numero = Object.keys(searchUsers.users).length;
                }).catch((error) => {
                    console.log("Something went terribly wrong: ", error);
                });
            }, 2000);
        }


        searchUsers.verificarUtilizadorExistente = async (email) => {
            let encontrou = false;
            let promiseProfessores = AllUsersService.getAllUsers("professores");
            await promiseProfessores.then(async (response) => {
                response.data.professores.forEach((professor, index) => {
                    if (professor.email == email) {
                        encontrou = true;
                    }
                });
            })
            let promiseAlunos = AllUsersService.getAllUsers("alunos");
            await promiseAlunos.then(async (response) => {
                response.data.alunos.forEach((aluno, index) => {
                    if (aluno.email == email) {
                        encontrou = true;
                    }
                });
            })

            return encontrou;

        }

        searchUsers.verificarTipoDeConta = async (email) => {
            let encontrouProf = false;
            let encontrouAlun = false;
            let encontrouAdm = false;
            let promiseProfessores = AllUsersService.getAllUsers("professores");
            await promiseProfessores.then(async (response) => {
                response.data.professores.forEach((professor, index) => {
                    if (professor.email == email) {
                        encontrouProf = true;
                    }
                });
            })
            let promiseAlunos = AllUsersService.getAllUsers("alunos");
            await promiseAlunos.then(async (response) => {
                response.data.alunos.forEach((aluno, index) => {
                    if (aluno.email == email) {
                        encontrouAlun = true;
                    }
                });
            });
            let promiseAdmin = AllUsersService.getAllUsers("admin");
            await promiseAdmin.then(async (response) => {
                response.data.admin.forEach((admin, index) => {
                    if (admin.email == email) {
                        encontrouAdm = true;
                    }
                });
            });
            if (encontrouProf) {
                return "prof";
            }
            if (encontrouAlun) {
                return "alun";
            }
            if (encontrouAdm) {
                return "adm";
            }
            if (!encontrouAlun && !encontrouProf && !encontrouAdm) {
                return "false";
            }

        }


        let promiseGetAllTeachers = AllUsersService.getAllUsers("professores");
        promiseGetAllTeachers.then((response) => {
            searchUsers.Teachers = response.data.professores;
        });
        let promiseGetAllStudents = AllUsersService.getAllUsers("alunos");
        promiseGetAllStudents.then((response) => {
            searchUsers.Students = response.data.alunos;
        });
        let promiseGetAllAdmin = AllUsersService.getAllUsers("admin");
        promiseGetAllAdmin.then((response) => {
            searchUsers.Admin = response.data.admin;
        });

        searchUsers.reloadAdmin = (user) => {
            let promiseGetAllUsersByUser = AllUsersService.getAllUsers(user);
            promiseGetAllUsersByUser.then((response) => {
                if (user == "professores") {
                    searchUsers.Teachers = response.data.professores;
                } else if (user == "alunos") {
                    searchUsers.Students = response.data.alunos;
                } else if (user == "admin") {
                    searchUsers.Admin = response.data.admin;
                }
            });
            searchUsers.reload();
            $scope.$apply();
        };



    }

    ProfileController.$inject = ['AllUsersService', 'AllAreasService', 'AllStudentsOfTeachersService', 'AllDisciplinasService', 'AllInstituicoesService', 'AllOrientacoesService', 'AllRecursosDigitaisService', 'AllLogsService', '$scope'];
    function ProfileController(AllUsersService, AllAreasService, AllStudentsOfTeachersService, AllDisciplinasService, AllInstituicoesService, AllOrientacoesService, AllRecursosDigitaisService, AllLogsService, $scope) {
        const profile = this;

        profile.profileEmail = null;


        if (sessionStorage.getItem("E-Teacher User Email") !== undefined) {
            profile.originalEmail = sessionStorage.getItem("E-Teacher User Email");
            profile.existe = true;
        }


        profile.changeLanguage = () => {
            const lingua = sessionStorage.getItem('E-Teacher Idioma');
            if (lingua === "pt") {
                document.getElementById("callLanguage").innerText = "Idioma";


                if (sessionStorage.getItem('E-Teacher User Tipo') == "professores") {
                    profile.permissions = 3;
                    profile.tipoDeConta = "professores";
                } else if (sessionStorage.getItem('E-Teacher User Tipo') == "alunos") {
                    profile.permissions = 2;
                    profile.tipoDeConta = "alunos";
                }


                //placeholder da searchbar
                if (document.getElementById("searchBarInput") !== null)
                    document.getElementById("searchBarInput").placeholder = "Pesquisar...";


                //placeholder da searchbarAdmin users
                if (document.getElementById("searchBarUsersInput") !== null)
                    document.getElementById("searchBarUsersInput").placeholder = "Digite aqui para pesquisar...";


                //placeholder da searchbarAdmin instituicoes
                if (document.getElementById("searchBarInstituicaoInput") !== null)
                    document.getElementById("searchBarInstituicaoInput").placeholder = "Digite aqui para pesquisar...";

                //placeholder da searchbarAdmin disciplinas
                if (document.getElementById("searchBarDisciplinasInput") !== null)
                    document.getElementById("searchBarDisciplinasInput").placeholder = "Digite aqui para pesquisar...";

                //placeholder da searchbarAdmin areas
                if (document.getElementById("searchBarAreasInput") !== null)
                    document.getElementById("searchBarAreasInput").placeholder = "Digite aqui para pesquisar...";

                //placeholder da searchbarAdmin logs
                if (document.getElementById("searchBarLogsInput") !== null)
                    document.getElementById("searchBarLogsInput").placeholder = "Digite aqui para pesquisar...";


                if (profile.originalEmail !== null) {
                    if (profile.permissions != 2) {
                        //profile

                        const traduzir = document.getElementsByClassName("traduzir");
                        let i = 0;
                        while (traduzir[i] != undefined) {
                            const pt = traduzir[i].getAttribute("pt");
                            traduzir[i].innerText = pt;
                            i++;
                        }

                    }
                }

            } else if (lingua === "en") {
                document.getElementById("callLanguage").innerText = "Language";
                //log in / sign in / verifiaction
                const loginTitulo = document.getElementsByClassName("loginTitulo");
                let i = 0;
                while (loginTitulo[i] != undefined) {
                    loginTitulo[i].innerText = "Log in";
                    i++;
                }

                //placeholder da searchbar
                if (document.getElementById("searchBarInput") !== null)
                    document.getElementById("searchBarInput").placeholder = "Search...";

                //placeholder da searchbarAdmin users
                if (document.getElementById("searchBarUsersInput") !== null)
                    document.getElementById("searchBarUsersInput").placeholder = "Type here to search...";

                //placeholder da searchbarAdmin instituicoes
                if (document.getElementById("searchBarInstituicaoInput") !== null)
                    document.getElementById("searchBarInstituicaoInput").placeholder = "Type here to search...";

                //placeholder da searchbarAdmin disciplinas
                if (document.getElementById("searchBarDisciplinasInput") !== null)
                    document.getElementById("searchBarDisciplinasInput").placeholder = "Type here to search...";

                //placeholder da searchbarAdmin areas
                if (document.getElementById("searchBarAreasInput") !== null)
                    document.getElementById("searchBarAreasInput").placeholder = "Type here to search...";

                //placeholder da searchbarAdmin logs
                if (document.getElementById("searchBarLogsInput") !== null)
                    document.getElementById("searchBarLogsInput").placeholder = "Type here to search...";


                if (profile.originalEmail !== null) {
                    if (profile.permissions != 2) {
                        //profile
                        const traduzir = document.getElementsByClassName("traduzir");
                        i = 0;
                        while (traduzir[i] != undefined) {
                            const eng = traduzir[i].getAttribute("eng");
                            traduzir[i].innerText = eng;
                            i++;
                        }

                    }
                }

            }
        }
        profile.changeLanguage();



        profile.consolelog = () => {
            console.log("ola;");
        };


        profile.Contains = (arr, key, val) => {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] === val) return true;
            }
            return false;
        }

        profile.checkIfProfessorTemEsteAluno = async (emailProfessor, emailAluno) => {
            let check = false;
            await AllStudentsOfTeachersService.getAllStudentsOfATeacher(emailProfessor).then((response) => {
                let alunosDoProfessor = response.data.professores[0].alunos;
                alunosDoProfessor.forEach((aluno, index) => {
                    if (aluno.email === emailAluno) {
                        //encontrou o aluno, pode alterar!
                        check = aluno;
                    }
                });
            });
            return check;
        };

        profile.checkIfProfessorTemEstaOrientacao = async (emailProfessor, idOrientacao) => {
            let check = false;
            await AllOrientacoesService.getOrientacoesDoProfessor(emailProfessor).then((response) => {
                let instituicoesDoProfessor = response.data.professores[0].instituicoes;
                instituicoesDoProfessor.forEach((instituicao, index) => {
                    let orientacoesDoProfessor = instituicao.Orientacoes;
                    orientacoesDoProfessor.forEach((orientacoes, index2) => {
                        if (orientacoes.id == idOrientacao) {
                            check = true;
                        }
                    });
                });

            });
            return check;
        }


        profile.checkIfProfessorTemEstaDisciplina = async (idDisciplina, idInstituicao, professorEmail) => {
            let check = false;
            await AllDisciplinasService.getAllDisciplinasFromATeacher(professorEmail).then((response) => {
                let instituicoesDoProfessor = response.data.professores[0].instituicao;
                instituicoesDoProfessor.forEach((instituicao, index) => {
                    if (instituicao.idInstituicao == idInstituicao) {
                        let disciplinasDoProfessor = instituicao.disciplinas;
                        disciplinasDoProfessor.forEach((disciplinas, index2) => {
                            if (disciplinas.idDisciplinas == idDisciplina) {
                                check = true;
                            }
                        });
                    }
                });
            });
            return check;
        }

        profile.checkIfProfessorTemEsteRecursoDigital = async (idRS) => {
            let check = false;
            await AllRecursosDigitaisService.getRecursosDigitaisDoProfessor(profile.profileEmail).then((response) => {
                profile.recursosDigitais = response.data.professores[0].recursosDigitais;
                profile.recursosDigitais.forEach((recursoDigital, index) => {
                    if (recursoDigital.id == idRS) {
                        check = true;
                    }
                });
            });
            return check;
        }

        profile.changeStudent = (jsonBody) => {
            const body = JSON.parse(jsonBody);
            const alunoEmail = body.alunoEmail;
            const alunoNome = body.alunoNome;
            const alunoNumero = body.alunoNumero;
            profile.alunos.forEach((aluno, index) => {
                if (aluno.email == alunoEmail) {
                    aluno.nome = alunoNome;
                    aluno.numero = alunoNumero;
                }
            });
        }


        profile.searchProfile = (emailProfile) => {
            if (sessionStorage.getItem('E-Teacher User Tipo') != "admin")
                setQueryStringParameter('searchUserProfile', emailProfile);

            if (sessionStorage.getItem('E-Teacher User Tipo') == "professores") {
                profile.permissions = 1;
                profile.tipoDeConta = "professores";
            } else {
                profile.permissions = 2;
                profile.tipoDeConta = "alunos";
            }


            const promiseGetAllRecursosDigitaisDoProfessor = AllRecursosDigitaisService.getRecursosDigitaisDoProfessor(emailProfile);
            promiseGetAllRecursosDigitaisDoProfessor.then((response) => {
                profile.recursosDigitais = response.data.professores[0].recursosDigitais;
            });

            const promiseGetProfile = AllUsersService.getProfile(emailProfile, "professores");
            promiseGetProfile.then((response) => {

                if (response.data.info != "Não existe nenhum user com esse email!") {
                    profile.existe = true;
                    profile.profileForEmail = response.data.professores;
                    profile.fotoPerfil = profile.profileForEmail[0].fotoPerfil;
                    profile.fotoFundo = profile.profileForEmail[0].fotoFundo;
                    profile.nome = profile.profileForEmail[0].nome;
                    if (profile.profileForEmail[0].exp != 0) {
                        profile.exp = profile.profileForEmail[0].exp;
                    } else {
                        profile.exp = "";
                    }
                    profile.idArea = profile.profileForEmail[0].idArea;
                    profile.orcidId = profile.profileForEmail[0].orcidId;
                    profile.resumo = profile.profileForEmail[0].resumo;
                    const year = new Date().getFullYear();
                    profile.years = year - response.data.professores[0].exp;
                    if (response.data.professores[0].exp == 0) {
                        profile.years = "";
                    }
                    if (profile.profileForEmail[0].idArea === 0 || profile.profileForEmail[0].idArea === "") {
                        profile.areaProfile = [{ "cor": "", "nome": "", "idArea": 0 }];
                    } else {
                        const promise2 = AllAreasService.getArea(profile.profileForEmail[0].idArea);
                        promise2.then((response) => {
                            profile.areaProfile = response.data.areas;
                        }).catch((error2) => {
                            console.log(error2);
                        });
                    }
                } else {
                    //caso não exista o perfil que estou a procura
                    profile.existe = false;
                }

            }).catch((error) => {
                console.log(error);
            });

            const promiseGetDisciplinasAtuais = AllDisciplinasService.getAllDisciplinasFromATeacher(emailProfile);
            promiseGetDisciplinasAtuais.then((response) => {

                if (response.data.info != "Não existe nenhum user com esse email!") {
                    let allDisciplinas1 = response.data.professores[0];
                    profile.instituicoesAtuais = allDisciplinas1.instituicao.filter((instituicoes, index) => {
                        let novasDisciplinas = [];
                        let semestre1 = false;
                        let semestre2 = false;
                        instituicoes.disciplinas.forEach((disciplinas) => {
                            if (disciplinas.estado === "t") {
                                novasDisciplinas.push(disciplinas);
                                if (disciplinas.semestre == 1) {
                                    semestre1 = true;
                                } else {
                                    semestre2 = true;
                                }
                            }

                        });

                        if (semestre1 == false) {
                            instituicoes.semestre1 = false;
                        } else {
                            instituicoes.semestre1 = true;
                        }

                        if (semestre2 == false) {
                            instituicoes.semestre2 = false;
                        } else {
                            instituicoes.semestre2 = true;
                        }
                        instituicoes.disciplinas = novasDisciplinas;
                        if (novasDisciplinas.length === 0) {
                            return null;
                        }

                        return instituicoes;
                    });
                }



            });

            const promiseGetDisciplinasHistorico = AllDisciplinasService.getAllDisciplinasFromATeacher(emailProfile);
            promiseGetDisciplinasHistorico.then((response) => {

                if (response.data.info != "Não existe nenhum user com esse email!") {
                    let allDisciplinas2 = response.data.professores[0];

                    allDisciplinas2.instituicao.forEach((instituicoes) => {
                        let novasDisciplinas = [];
                        instituicoes.disciplinas.forEach((disciplinas) => {
                            if (!profile.Contains(novasDisciplinas, "idDisciplinas", disciplinas.idDisciplinas)) {
                                novasDisciplinas.push(disciplinas);
                            }

                        });
                        instituicoes.disciplinas = novasDisciplinas;


                    });
                    profile.instituicoesHistorico = allDisciplinas2.instituicao;
                }
            });


            const promiseGetStudents = AllStudentsOfTeachersService.getAllStudentsOfATeacher(emailProfile);
            promiseGetStudents.then((response) => {
                if (response.data.info != "Não existe nenhum user com esse email!") {
                    profile.alunos = response.data.professores[0].alunos;
                }
            });


            const promiseGetOrientacoesDesteProfessor = AllOrientacoesService.getOrientacoesDoProfessor(emailProfile);
            promiseGetOrientacoesDesteProfessor.then((response) => {
                profile.orientacoes = response.data.professores[0];
            });


            const promiseGetOrientacoesDesteProfessorAtuais = AllOrientacoesService.getOrientacoesDoProfessor(emailProfile);
            promiseGetOrientacoesDesteProfessorAtuais.then((response) => {
                let orientacoes = response.data.professores[0];
                profile.orientacoesAtuais = orientacoes.instituicoes.filter((instituicoes, index) => {
                    let novasOrientacoes = [];
                    let mestre = false;
                    let doutor = false;
                    instituicoes.Orientacoes.forEach((orientacoes) => {

                        if (orientacoes.dataFim === 0) {
                            novasOrientacoes.push(orientacoes);
                            if (orientacoes.titulo == "t") {
                                mestre = true;
                            } else {
                                doutor = true;
                            }
                        }

                    });
                    if (mestre == false) {
                        instituicoes.mestre = false;
                    } else {
                        instituicoes.mestre = true;
                    }

                    if (doutor == false) {
                        instituicoes.doutor = false;
                    } else {
                        instituicoes.doutor = true;
                    }
                    instituicoes.Orientacoes = novasOrientacoes;
                    if (novasOrientacoes.length === 0) {
                        return null;
                    }
                    return instituicoes;
                });
            });

            const promiseGetOrientacoesDesteProfessorHistorico = AllOrientacoesService.getOrientacoesDoProfessor(emailProfile);
            promiseGetOrientacoesDesteProfessorHistorico.then((response) => {
                let orientacoes = response.data.professores[0];
                profile.orientacoesHistorico = orientacoes.instituicoes.filter((instituicoes, index) => {
                    let novasOrientacoes = [];
                    let mestre = false;
                    let doutor = false;
                    instituicoes.Orientacoes.forEach((orientacoes) => {
                        if (orientacoes.dataFim !== 0) {
                            novasOrientacoes.push(orientacoes);
                            if (orientacoes.titulo == "t") {
                                mestre = true;
                            } else {
                                doutor = true;
                            }
                        }

                    });

                    if (mestre == false) {
                        instituicoes.mestre = false;
                    } else {
                        instituicoes.mestre = true;
                    }

                    if (doutor == false) {
                        instituicoes.doutor = false;
                    } else {
                        instituicoes.doutor = true;
                    }
                    instituicoes.Orientacoes = novasOrientacoes;
                    if (novasOrientacoes.length === 0) {
                        return null;
                    }

                    return instituicoes;
                });
            });



        };

        profile.viewMyProfile = () => {
            if (sessionStorage.getItem('E-Teacher User Email') !== null) {

                if (sessionStorage.getItem('E-Teacher User Tipo') == "professores") {
                    profile.permissions = 3;
                    profile.tipoDeConta = "professores";
                    if (sessionStorage.getItem('E-Teacher User Tipo') != "admin")
                        setQueryStringParameter('searchUserProfile', profile.profileEmail);
                } else {
                    profile.permissions = 2;
                    profile.tipoDeConta = "alunos";
                }

                const promiseGetAllRecursosDigitaisDoProfessor = AllRecursosDigitaisService.getRecursosDigitaisDoProfessor(profile.profileEmail);
                promiseGetAllRecursosDigitaisDoProfessor.then((response) => {
                    profile.recursosDigitais = response.data.professores[0].recursosDigitais;
                });


                const promiseGetDisciplinasAtuais = AllDisciplinasService.getAllDisciplinasFromATeacher(profile.profileEmail);
                promiseGetDisciplinasAtuais.then((response) => {

                    if (response.data.info != "Não existe nenhum user com esse email!") {
                        let allDisciplinas1 = response.data.professores[0];
                        profile.instituicoesAtuais = allDisciplinas1.instituicao.filter((instituicoes, index) => {
                            let novasDisciplinas = [];
                            let semestre1 = false;
                            let semestre2 = false;
                            instituicoes.disciplinas.forEach((disciplinas) => {
                                if (disciplinas.estado === "t") {
                                    novasDisciplinas.push(disciplinas);
                                    if (disciplinas.semestre == 1) {
                                        semestre1 = true;
                                    } else {
                                        semestre2 = true;
                                    }
                                }

                            });

                            if (semestre1 == false) {
                                instituicoes.semestre1 = false;
                            } else {
                                instituicoes.semestre1 = true;
                            }

                            if (semestre2 == false) {
                                instituicoes.semestre2 = false;
                            } else {
                                instituicoes.semestre2 = true;
                            }
                            instituicoes.disciplinas = novasDisciplinas;
                            if (novasDisciplinas.length === 0) {
                                return null;
                            }

                            return instituicoes;
                        });
                    }



                });

                const promiseGetDisciplinasHistorico = AllDisciplinasService.getAllDisciplinasFromATeacher(profile.profileEmail);
                promiseGetDisciplinasHistorico.then((response) => {
                    let allDisciplinas2 = response.data.professores[0];

                    allDisciplinas2.instituicao.forEach((instituicoes) => {
                        let novasDisciplinas = [];
                        instituicoes.disciplinas.forEach((disciplinas) => {
                            if (!profile.Contains(novasDisciplinas, "idDisciplinas", disciplinas.idDisciplinas)) {
                                novasDisciplinas.push(disciplinas);
                            }

                        });
                        instituicoes.disciplinas = novasDisciplinas;


                    });
                    profile.instituicoesHistorico = allDisciplinas2.instituicao;


                });



                profile.profileEmail = sessionStorage.getItem('E-Teacher User Email');
                const promiseGetProfile = AllUsersService.getProfile(profile.profileEmail, "professores");
                promiseGetProfile.then((response) => {
                    profile.existe = true;
                    profile.profileForEmail = response.data.professores;
                    profile.fotoPerfil = profile.profileForEmail[0].fotoPerfil;
                    profile.fotoFundo = profile.profileForEmail[0].fotoFundo;
                    profile.nome = profile.profileForEmail[0].nome;
                    if (profile.profileForEmail[0].exp != 0) {
                        profile.exp = profile.profileForEmail[0].exp;
                    } else {
                        profile.exp = "";
                    }
                    profile.idArea = profile.profileForEmail[0].idArea;
                    profile.orcidId = profile.profileForEmail[0].orcidId;
                    profile.resumo = profile.profileForEmail[0].resumo;

                    const year = new Date().getFullYear();
                    profile.years = year - response.data.professores[0].exp;
                    if (response.data.professores[0].exp == 0) {
                        profile.years = "";
                    }
                    if (profile.profileForEmail[0].idArea === 0 || profile.profileForEmail[0].idArea === "") {
                        profile.areaProfile = [{ "cor": "", "nome": "", "idArea": 0 }];
                    } else {
                        const promise2 = AllAreasService.getArea(profile.profileForEmail[0].idArea);
                        promise2.then((response) => {
                            profile.areaProfile = response.data.areas;
                        }).catch((error2) => {
                            console.log(error2);
                        });
                    }



                    const promiseGetOrientacoesDesteProfessor = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                    promiseGetOrientacoesDesteProfessor.then((response) => {
                        profile.orientacoes = response.data.professores[0];
                    });

                    const promiseGetOrientacoesDesteProfessorAtuais = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                    promiseGetOrientacoesDesteProfessorAtuais.then((response) => {
                        let orientacoes = response.data.professores[0];
                        profile.orientacoesAtuais = orientacoes.instituicoes.filter((instituicoes, index) => {
                            let novasOrientacoes = [];
                            let mestre = false;
                            let doutor = false;
                            instituicoes.Orientacoes.forEach((orientacoes) => {

                                if (orientacoes.dataFim === 0) {
                                    novasOrientacoes.push(orientacoes);
                                    if (orientacoes.titulo == "t") {
                                        mestre = true;
                                    } else {
                                        doutor = true;
                                    }
                                }

                            });
                            if (mestre == false) {
                                instituicoes.mestre = false;
                            } else {
                                instituicoes.mestre = true;
                            }

                            if (doutor == false) {
                                instituicoes.doutor = false;
                            } else {
                                instituicoes.doutor = true;
                            }
                            instituicoes.Orientacoes = novasOrientacoes;
                            if (novasOrientacoes.length === 0) {
                                return null;
                            }
                            return instituicoes;
                        });
                    });

                    const promiseGetOrientacoesDesteProfessorHistorico = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                    promiseGetOrientacoesDesteProfessorHistorico.then((response) => {
                        let orientacoes = response.data.professores[0];
                        profile.orientacoesHistorico = orientacoes.instituicoes.filter((instituicoes, index) => {
                            let novasOrientacoes = [];
                            let mestre = false;
                            let doutor = false;
                            instituicoes.Orientacoes.forEach((orientacoes) => {
                                if (orientacoes.dataFim !== 0) {
                                    novasOrientacoes.push(orientacoes);
                                    if (orientacoes.titulo == "t") {
                                        mestre = true;
                                    } else {
                                        doutor = true;
                                    }
                                }

                            });

                            if (mestre == false) {
                                instituicoes.mestre = false;
                            } else {
                                instituicoes.mestre = true;
                            }

                            if (doutor == false) {
                                instituicoes.doutor = false;
                            } else {
                                instituicoes.doutor = true;
                            }
                            instituicoes.Orientacoes = novasOrientacoes;
                            if (novasOrientacoes.length === 0) {
                                return null;
                            }

                            return instituicoes;
                        });
                    });

                    const promiseGetStudents = AllStudentsOfTeachersService.getAllStudentsOfATeacher(profile.profileEmail);
                    promiseGetStudents.then((response) => {
                        profile.alunos = response.data.professores[0].alunos;
                    });

                    const promiseGetStudentsPorEscolher = AllStudentsOfTeachersService.getAllStudentsOfATeacher(profile.profileEmail);
                    promiseGetStudentsPorEscolher.then((response) => {
                        profile.alunosPorEscolher = response.data.professores[0].alunos;
                        if (profile.alunosPorEscolher.length == 0) {
                            if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                                profile.alunosPorEscolher.push({ "email": 0, "nome": 'Vazio', "numero": 'Por favor adicione na aba alunos.' });
                            } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                                profile.alunosPorEscolher.push({ "email": 0, "nome": 'None', "numero": 'Please enter in the Students tab.' });
                            }
                        }
                    });


                }).catch((error) => {
                    profile.existe = false;
                    console.log(error);
                });
            }
        };

        if (sessionStorage.getItem('E-Teacher User Email') !== null) {

            profile.profileEmail = sessionStorage.getItem('E-Teacher User Email');

            if (sessionStorage.getItem('E-Teacher User Tipo') == "professores" && sessionStorage.getItem('E-Teacher User Tipo') != "admin") {
                profile.permissions = 3;
                profile.tipoDeConta = "professores";

                profile.existe = true;

                if (sessionStorage.getItem('E-Teacher User Tipo') != "admin")
                    setQueryStringParameter('searchUserProfile', profile.profileEmail);



                const promiseGetAllRecursosDigitaisDoProfessor = AllRecursosDigitaisService.getRecursosDigitaisDoProfessor(profile.profileEmail);
                promiseGetAllRecursosDigitaisDoProfessor.then((response) => {
                    profile.recursosDigitais = response.data.professores[0].recursosDigitais;
                });

                const promiseGetDisciplinasAtuais = AllDisciplinasService.getAllDisciplinasFromATeacher(profile.profileEmail);
                promiseGetDisciplinasAtuais.then((response) => {

                    if (response.data.info != "Não existe nenhum user com esse email!") {
                        let allDisciplinas1 = response.data.professores[0];
                        profile.instituicoesAtuais = allDisciplinas1.instituicao.filter((instituicoes, index) => {
                            let novasDisciplinas = [];
                            let semestre1 = false;
                            let semestre2 = false;
                            instituicoes.disciplinas.forEach((disciplinas) => {
                                if (disciplinas.estado === "t") {
                                    novasDisciplinas.push(disciplinas);
                                    if (disciplinas.semestre == 1) {
                                        semestre1 = true;
                                    } else {
                                        semestre2 = true;
                                    }
                                }

                            });

                            if (semestre1 == false) {
                                instituicoes.semestre1 = false;
                            } else {
                                instituicoes.semestre1 = true;
                            }

                            if (semestre2 == false) {
                                instituicoes.semestre2 = false;
                            } else {
                                instituicoes.semestre2 = true;
                            }
                            instituicoes.disciplinas = novasDisciplinas;
                            if (novasDisciplinas.length === 0) {
                                return null;
                            }

                            return instituicoes;
                        });
                    }



                });

                const promiseGetDisciplinasHistorico = AllDisciplinasService.getAllDisciplinasFromATeacher(profile.profileEmail);
                promiseGetDisciplinasHistorico.then((response) => {
                    let allDisciplinas2 = response.data.professores[0];

                    allDisciplinas2.instituicao.forEach((instituicoes) => {
                        let novasDisciplinas = [];
                        instituicoes.disciplinas.forEach((disciplinas) => {
                            if (!profile.Contains(novasDisciplinas, "idDisciplinas", disciplinas.idDisciplinas)) {
                                novasDisciplinas.push(disciplinas);
                            }

                        });
                        instituicoes.disciplinas = novasDisciplinas;


                    });
                    profile.instituicoesHistorico = allDisciplinas2.instituicao;


                });

                const promiseGetProfile = AllUsersService.getProfile(profile.profileEmail, "professores");
                promiseGetProfile.then((response) => {

                    profile.profileForEmail = response.data.professores;

                    profile.fotoPerfil = profile.profileForEmail[0].fotoPerfil;
                    profile.fotoFundo = profile.profileForEmail[0].fotoFundo;
                    profile.nome = profile.profileForEmail[0].nome;
                    if (profile.profileForEmail[0].exp != 0) {
                        profile.exp = profile.profileForEmail[0].exp;
                    } else {
                        profile.exp = "";
                    }
                    profile.idArea = profile.profileForEmail[0].idArea;
                    profile.orcidId = profile.profileForEmail[0].orcidId;
                    profile.orcidIdInputValue = profile.orcidId;
                    profile.resumo = profile.profileForEmail[0].resumo;

                    const year = new Date().getFullYear();
                    profile.years = year - response.data.professores[0].exp;
                    if (response.data.professores[0].exp == 0) {
                        profile.years = "";
                    }
                    if (profile.profileForEmail[0].idArea === 0 || profile.profileForEmail[0].idArea === "") {
                        profile.areaProfile = [{ "cor": "", "nome": "", "idArea": 0 }];
                    } else {
                        const promise2 = AllAreasService.getArea(profile.profileForEmail[0].idArea);
                        promise2.then((response) => {
                            profile.areaProfile = response.data.areas;
                        }).catch((error2) => {
                            console.log(error2);
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                });


                const promiseGetStudents = AllStudentsOfTeachersService.getAllStudentsOfATeacher(profile.profileEmail);
                promiseGetStudents.then((response) => {
                    profile.alunos = response.data.professores[0].alunos;
                });

                const promiseGetStudentsPorEscolher = AllStudentsOfTeachersService.getAllStudentsOfATeacher(profile.profileEmail);
                promiseGetStudentsPorEscolher.then((response) => {
                    profile.alunosPorEscolher = response.data.professores[0].alunos;
                    if (profile.alunosPorEscolher.length == 0) {
                        if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                            profile.alunosPorEscolher.push({ "email": 0, "nome": 'Vazio', "numero": 'Por favor adicione na aba alunos.' });
                        } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                            profile.alunosPorEscolher.push({ "email": 0, "nome": 'None', "numero": 'Please enter in the Students tab.' });
                        }
                    }
                });



                const promiseGetOrientacoesDesteProfessor = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                promiseGetOrientacoesDesteProfessor.then((response) => {
                    profile.orientacoes = response.data.professores[0];
                });

                const promiseGetOrientacoesDesteProfessorAtuais = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                promiseGetOrientacoesDesteProfessorAtuais.then((response) => {
                    let orientacoes = response.data.professores[0];
                    profile.orientacoesAtuais = orientacoes.instituicoes.filter((instituicoes, index) => {
                        let novasOrientacoes = [];
                        let mestre = false;
                        let doutor = false;
                        instituicoes.Orientacoes.forEach((orientacoes) => {

                            if (orientacoes.dataFim === 0) {
                                novasOrientacoes.push(orientacoes);
                                if (orientacoes.titulo == "t") {
                                    mestre = true;
                                } else {
                                    doutor = true;
                                }
                            }

                        });
                        if (mestre == false) {
                            instituicoes.mestre = false;
                        } else {
                            instituicoes.mestre = true;
                        }

                        if (doutor == false) {
                            instituicoes.doutor = false;
                        } else {
                            instituicoes.doutor = true;
                        }
                        instituicoes.Orientacoes = novasOrientacoes;
                        if (novasOrientacoes.length === 0) {
                            return null;
                        }
                        return instituicoes;
                    });
                });

                const promiseGetOrientacoesDesteProfessorHistorico = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                promiseGetOrientacoesDesteProfessorHistorico.then((response) => {
                    let orientacoes = response.data.professores[0];
                    profile.orientacoesHistorico = orientacoes.instituicoes.filter((instituicoes, index) => {
                        let novasOrientacoes = [];
                        let mestre = false;
                        let doutor = false;
                        instituicoes.Orientacoes.forEach((orientacoes) => {
                            if (orientacoes.dataFim !== 0) {
                                novasOrientacoes.push(orientacoes);
                                if (orientacoes.titulo == "t") {
                                    mestre = true;
                                } else {
                                    doutor = true;
                                }
                            }

                        });

                        if (mestre == false) {
                            instituicoes.mestre = false;
                        } else {
                            instituicoes.mestre = true;
                        }

                        if (doutor == false) {
                            instituicoes.doutor = false;
                        } else {
                            instituicoes.doutor = true;
                        }
                        instituicoes.Orientacoes = novasOrientacoes;
                        if (novasOrientacoes.length === 0) {
                            return null;
                        }

                        return instituicoes;
                    });
                });

                profile.alterarOrcidId = (orcidId) => {
                    profile.orcidId = orcidId;
                    $scope.$apply();
                };


                profile.MudarFoto = (ondeE, url) => {
                    if (ondeE == "fotoPerfil") {
                        profile.fotoPerfil = url;
                    } else if (ondeE == "fotoFundo") {
                        profile.fotoFundo = url;
                    }
                }

                profile.apagarFoto = (ondeE) => {
                    if (ondeE == "fotoPerfil") {
                        profile.fotoPerfil = "https://www.legal-tech.de/wp-content/uploads/Profilbild-Platzhalter.png";
                    } else if (ondeE == "fotoFundo") {
                        profile.fotoFundo = "https://www.tarabba.com.au/wp-content/uploads/2015/09/Empty-Background.png";
                    }
                }


                profile.MudarPerfil = (nome, exp, idArea, resumo) => {
                    const resultado = new Date().getFullYear() - exp;
                    if (resultado > 0) {
                        profile.nome = nome;
                        if (profile.profileForEmail[0].exp != 0) {
                            profile.exp = profile.profileForEmail[0].exp;
                        } else {
                            profile.exp = "";
                        }
                        profile.idArea = idArea;
                        profile.resumo = resumo;

                        const year = new Date().getFullYear();
                        profile.years = year - exp;
                        if (exp == 0) {
                            profile.years = "";
                        }

                        if (profile.profileForEmail[0].idArea === 0 || profile.profileForEmail[0].idArea === "") {
                            profile.areaProfile = [{ "cor": "", "nome": "", "idArea": 0 }];
                        } else {
                            const promise2 = AllAreasService.getArea(profile.profileForEmail[0].idArea);
                            promise2.then((response) => {
                                profile.areaProfile = response.data.areas;
                            }).catch((error2) => {
                                console.log(error2);
                            });
                        }
                        if (profile.idArea === 0) {
                            profile.areaProfile = [{ "cor": "#0d6efd", "nome": "", "idArea": 0 }];
                            profile.areaCor = "";
                            profile.areaNome = "";
                        } else {
                            const promise2 = AllAreasService.getAllAreas();
                            promise2.then((response) => {
                                profile.allAreas = response.data.areas;
                                if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                                    profile.allAreas.push({ idArea: 0, nome: 'Vazio', cor: '' });
                                } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                                    profile.allAreas.push({ idArea: 0, nome: 'None', cor: '' });
                                }
                                profile.allAreas.forEach((area, index) => {
                                    if (profile.idArea == area.idArea) {
                                        profile.areaCor = area.cor;
                                        profile.areaNome = area.nome;
                                    }
                                });
                            });
                        }
                    }
                }

                profile.addAlunoAoProfessor = async (alunoNumero) => {
                    let existe = false;
                    profile.alunos.forEach((element2, index) => {
                        if (element2.numero === alunoNumero) {
                            existe = true;
                        }
                    });

                    if (!existe) {
                        const promiseAlunoNovo = AllUsersService.getProfile(alunoNumero, "alunos");
                        await promiseAlunoNovo.then((response) => {
                            if (response.data.info !== "Numero inexistente!") {
                                profile.alunos.push({ "email": response.data.alunos[0].email, "nome": response.data.alunos[0].nome, "numero": response.data.alunos[0].numeroDeAluno });
                                openNotification("Aluno adicionado com sucesso!", "Student successfully added!");
                            }
                        });
                    }
                    profile.alunosPorEscolher = profile.alunos;
                    $scope.$apply();
                };

                profile.eliminarAlunoDoProfessor = (alunoEmail) => {
                    profile.alunos.forEach((element, index) => {
                        if (element.email === alunoEmail) {
                            profile.alunos.splice(index, 1);
                        }
                    });
                    if (profile.alunos.length != 0) {
                        profile.alunosPorEscolher = profile.alunos;
                    } else {
                        if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                            profile.alunosPorEscolher.push({ "email": 0, "nome": 'Vazio', "numero": 'Por favor adicione na aba alunos.' });
                        } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                            profile.alunosPorEscolher.push({ "email": 0, "nome": 'None', "numero": 'Please enter in the Students tab.' });
                        }
                    }
                    openNotification("Aluno removido com sucesso!", "Student successfully removed!");
                    $scope.$apply();
                };


                profile.reloadDisciplinas = () => {
                    const promiseGetDisciplinasAtuaisNoReload = AllDisciplinasService.getAllDisciplinasFromATeacher(profile.profileEmail);
                    promiseGetDisciplinasAtuaisNoReload.then((response) => {

                        if (response.data.info != "Não existe nenhum user com esse email!") {
                            let allDisciplinas1 = response.data.professores[0];
                            profile.instituicoesAtuais = allDisciplinas1.instituicao.filter((instituicoes, index) => {
                                let novasDisciplinas = [];
                                let semestre1 = false;
                                let semestre2 = false;
                                instituicoes.disciplinas.forEach((disciplinas) => {
                                    if (disciplinas.estado === "t") {
                                        novasDisciplinas.push(disciplinas);
                                        if (disciplinas.semestre == 1) {
                                            semestre1 = true;
                                        } else {
                                            semestre2 = true;
                                        }
                                    }

                                });

                                if (semestre1 == false) {
                                    instituicoes.semestre1 = false;
                                } else {
                                    instituicoes.semestre1 = true;
                                }

                                if (semestre2 == false) {
                                    instituicoes.semestre2 = false;
                                } else {
                                    instituicoes.semestre2 = true;
                                }
                                instituicoes.disciplinas = novasDisciplinas;
                                if (novasDisciplinas.length === 0) {
                                    return null;
                                }

                                return instituicoes;
                            });
                        }



                    });

                    const promiseGetDisciplinasHistoricoNoReaload = AllDisciplinasService.getAllDisciplinasFromATeacher(profile.profileEmail);
                    promiseGetDisciplinasHistoricoNoReaload.then((response) => {
                        let allDisciplinas2 = response.data.professores[0];

                        allDisciplinas2.instituicao.forEach((instituicoes) => {
                            let novasDisciplinas = [];
                            instituicoes.disciplinas.forEach((disciplinas) => {
                                if (!profile.Contains(novasDisciplinas, "idDisciplinas", disciplinas.idDisciplinas)) {
                                    novasDisciplinas.push(disciplinas);
                                }

                            });
                            instituicoes.disciplinas = novasDisciplinas;


                        });
                        profile.instituicoesHistorico = allDisciplinas2.instituicao;


                    });

                    $scope.$apply();


                }

                profile.reloadOrientations = () => {


                    const promiseGetOrientacoesDesteProfessor = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                    promiseGetOrientacoesDesteProfessor.then((response) => {
                        profile.orientacoes = response.data.professores[0];
                    });
                    const promiseGetOrientacoesDesteProfessorAtuais = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                    promiseGetOrientacoesDesteProfessorAtuais.then((response) => {
                        let orientacoes = response.data.professores[0];
                        profile.orientacoesAtuais = orientacoes.instituicoes.filter((instituicoes, index) => {
                            let novasOrientacoes = [];
                            let mestre = false;
                            let doutor = false;
                            instituicoes.Orientacoes.forEach((orientacoes) => {

                                if (orientacoes.dataFim === 0) {
                                    novasOrientacoes.push(orientacoes);
                                    if (orientacoes.titulo == "t") {
                                        mestre = true;
                                    } else {
                                        doutor = true;
                                    }
                                }

                            });
                            if (mestre == false) {
                                instituicoes.mestre = false;
                            } else {
                                instituicoes.mestre = true;
                            }

                            if (doutor == false) {
                                instituicoes.doutor = false;
                            } else {
                                instituicoes.doutor = true;
                            }
                            instituicoes.Orientacoes = novasOrientacoes;
                            if (novasOrientacoes.length === 0) {
                                return null;
                            }
                            return instituicoes;
                        });
                    });

                    const promiseGetOrientacoesDesteProfessorHistorico = AllOrientacoesService.getOrientacoesDoProfessor(profile.profileEmail);
                    promiseGetOrientacoesDesteProfessorHistorico.then((response) => {
                        let orientacoes = response.data.professores[0];
                        profile.orientacoesHistorico = orientacoes.instituicoes.filter((instituicoes, index) => {
                            let novasOrientacoes = [];
                            let mestre = false;
                            let doutor = false;
                            instituicoes.Orientacoes.forEach((orientacoes) => {
                                if (orientacoes.dataFim !== 0) {
                                    novasOrientacoes.push(orientacoes);
                                    if (orientacoes.titulo == "t") {
                                        mestre = true;
                                    } else {
                                        doutor = true;
                                    }
                                }

                            });

                            if (mestre == false) {
                                instituicoes.mestre = false;
                            } else {
                                instituicoes.mestre = true;
                            }

                            if (doutor == false) {
                                instituicoes.doutor = false;
                            } else {
                                instituicoes.doutor = true;
                            }
                            instituicoes.Orientacoes = novasOrientacoes;
                            if (novasOrientacoes.length === 0) {
                                return null;
                            }

                            return instituicoes;
                        });
                    });
                }

            } else if (sessionStorage.getItem('E-Teacher User Tipo') != "admin") {
                profile.permissions = 2;
                profile.tipoDeConta = "alunos";
                const promiseGetTeachersOfAStudent = AllStudentsOfTeachersService.getAllTeachersOfAStudent(profile.profileEmail);
                promiseGetTeachersOfAStudent.then((response) => {
                    if (response.data.alunos !== undefined)
                        profile.teachersOfAStudent = response.data.alunos[0].professores;
                    else
                        profile.teachersOfAStudent = { "Nome": "Ainda", "email": "email", "fotoPerfil": "fotoPerfil" };

                });


            } else {
                //é admin
                const promiseGetAllLogs = AllLogsService.getAllLogs();
                promiseGetAllLogs.then((response) => {
                    profile.logsAdmin = response.data.logs;
                });

                profile.reloadAllLogs = () => {
                    const promiseGetAllLogsNoReload = AllLogsService.getAllLogs();
                    promiseGetAllLogsNoReload.then((response) => {
                        profile.logsAdmin = response.data.logs;
                    });
                }

            }

            const promiseGetAllInstituicoes = AllInstituicoesService.getAllInstituicoes();
            promiseGetAllInstituicoes.then((response) => {
                profile.AllInstituicoes = response.data.instituicao;
            });

            const promiseGetAllDisciplinas = AllDisciplinasService.getAllDisciplinas();
            promiseGetAllDisciplinas.then((response) => {
                profile.AllDisciplinas = response.data.disciplinas;
            });

            profile.reloadAllInstituicoes = () => {
                const promiseGetAllInstituicoesNoReload = AllInstituicoesService.getAllInstituicoes();
                promiseGetAllInstituicoesNoReload.then((response) => {
                    profile.AllInstituicoes = response.data.instituicao;
                });
            };

            profile.reloadAllDisciplinas = () => {
                const promiseGetAllDisciplinasNoReload = AllDisciplinasService.getAllDisciplinas();
                promiseGetAllDisciplinasNoReload.then((response) => {
                    profile.AllDisciplinas = response.data.disciplinas;
                });
            };

            profile.reloadAllAreas = () => {
                const promiseGetAllAreasNoReload = AllAreasService.getAllAreas();
                promiseGetAllAreasNoReload.then((response) => {
                    profile.allAreas = response.data.areas;
                });
            };

            const promiseGetAllArea = AllAreasService.getAllAreas();
            promiseGetAllArea.then((response) => {
                profile.allAreas = response.data.areas;
                if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                    profile.allAreas.push({ idArea: 0, nome: 'Vazio', cor: '' });
                } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                    profile.allAreas.push({ idArea: 0, nome: 'None', cor: '' });
                }
                profile.allAreas.forEach((area, index) => {
                    if (profile.idArea == area.idArea) {
                        profile.areaCor = area.cor;
                        profile.areaNome = area.nome;
                    }
                });
            });

            profile.reloadRecursosDigitais = () => {
                const promiseGetAllRecursosDigitaisDoProfessorNoReload = AllRecursosDigitaisService.getRecursosDigitaisDoProfessor(profile.profileEmail);
                promiseGetAllRecursosDigitaisDoProfessorNoReload.then((response) => {
                    profile.recursosDigitais = response.data.professores[0].recursosDigitais;
                });
            }
        }

    }

    TrabalhosController.$inject = ['AllTrabalhosService', 'AllUsersService', 'AllAreasService', '$scope'];
    function TrabalhosController(AllTrabalhosService, AllUsersService, AllAreasService, $scope) {
        const trabalhos = this;

        trabalhos.profileEmail = null;
        trabalhos.getProfileEmail = () => {
            return trabalhos.profileEmail;
        }


        trabalhos.consolelog = () => {
            console.log("ola;");
        };



        trabalhos.checkIfProfessorTemEsteProjetoDeFinalDeCurso = async (idTrabalho) => {
            let check = false;
            await AllTrabalhosService.getTrabalhosFrom(trabalhos.profileEmail).then((response) => {
                let trabalhosDoProfessor = response.data.professores[0].trabalhos;
                trabalhosDoProfessor.forEach((trabalho, index) => {
                    if (trabalho.idTrabalho === idTrabalho) {
                        //encontrou o trabalho, pode alterar!
                        check = trabalho;
                    }
                });
            });
            return check;
        };

        trabalhos.checkIfProfessorTemEsteResearchProjetoDeFinalDeCurso = async (idTrabalho) => {
            let check = false;
            await AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail).then((response) => {
                let trabalhosDoProfessor = response.data.professores[0].projetosInvestigacao;
                trabalhosDoProfessor.forEach((trabalho, index) => {
                    if (trabalho.id == idTrabalho) {
                        //encontrou o trabalho, pode alterar!
                        check = trabalho;
                    }
                });
            });
            return check;
        };


        trabalhos.trabalhosSearch = (searchEmail) => {
            trabalhos.profileEmail = searchEmail;
            const promiseGetTrabalhos = AllTrabalhosService.getTrabalhosFrom(searchEmail);
            promiseGetTrabalhos.then((response) => {
                if (response.data.info != "Não existe nenhum professor com esse email!") {

                    trabalhos.trabalhosForProfessor = response.data.professores[0].trabalhos;
                    trabalhos.trabalhosForProfessor.forEach((AllTrabalhos, index) => {
                        if (sessionStorage.getItem('E-Teacher User Tipo') == "alunos") {
                            const alunoEmail = sessionStorage.getItem('E-Teacher User Email');
                            var result = AllTrabalhos.alunos.filter(x => x.email === alunoEmail);
                            if (result.length != 0) {
                                //pode alterar
                                trabalhos.trabalhosForProfessor[index].podeAlterar = true;
                            } else {
                                trabalhos.trabalhosForProfessor[index].podeAlterar = false;
                            }
                        }
                    });

                }
            }).catch((error) => {
                console.log(error);
            });

            const promiseGetProjetosDeInvestigacaoAtuais = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
            promiseGetProjetosDeInvestigacaoAtuais.then((response) => {
                if (response.data.info != "Não existe nenhum professor com esse email!") {
                    let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                    let novosProjetosPesquisa = [];
                    //adicionar aqui

                    projetosInvestigacao.forEach((projetos, index) => {
                        if (projetos.dataFim == 0) {
                            if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                                projetos.dataFim = "até o momento";
                            } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                                projetos.dataFim = "at the moment";
                            }
                            novosProjetosPesquisa.push(projetos);
                        }
                    });
                    trabalhos.trabalhosDePesquisaForProfessorAtuais = novosProjetosPesquisa;
                }
            });

            const promiseGetProjetosDeInvestigacaoHistorico = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
            promiseGetProjetosDeInvestigacaoHistorico.then((response) => {
                if (response.data.info != "Não existe nenhum professor com esse email!") {
                    let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                    let novosProjetosPesquisa = [];
                    //adicionar aqui

                    projetosInvestigacao.forEach((projetos, index) => {
                        if (projetos.dataFim != 0) {
                            novosProjetosPesquisa.push(projetos);
                        }
                    });
                    trabalhos.trabalhosDePesquisaForProfessorHistorico = novosProjetosPesquisa;
                }
            });

        };

        trabalhos.closeSearch = () => {
            trabalhos.profileEmail = sessionStorage.getItem('E-Teacher User Email');
            const promiseGetTrabalhos = AllTrabalhosService.getTrabalhosFrom(trabalhos.profileEmail);
            promiseGetTrabalhos.then((response) => {
                trabalhos.trabalhosForProfessor = response.data.professores[0].trabalhos;
                trabalhos.trabalhosForProfessor.forEach((AllTrabalhos, index) => {
                    trabalhos.trabalhosForProfessor[index].podeAlterar = true;
                });
            }).catch((error) => {
                console.log(error);
            });
            const promiseGetProjetosDeInvestigacaoAtuais = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
            promiseGetProjetosDeInvestigacaoAtuais.then((response) => {
                if (response.data.info != "Não existe nenhum professor com esse email!") {
                    let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                    let novosProjetosPesquisa = [];
                    //adicionar aqui

                    projetosInvestigacao.forEach((projetos, index) => {
                        if (projetos.dataFim == 0) {
                            if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                                projetos.dataFim = "até o momento";
                            } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                                projetos.dataFim = "at the moment";
                            }
                            projetos.podeAlterar = true;
                            novosProjetosPesquisa.push(projetos);
                        }
                    });
                    trabalhos.trabalhosDePesquisaForProfessorAtuais = novosProjetosPesquisa;
                }
            });

            const promiseGetProjetosDeInvestigacaoHistorico = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
            promiseGetProjetosDeInvestigacaoHistorico.then((response) => {
                if (response.data.info != "Não existe nenhum professor com esse email!") {
                    let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                    let novosProjetosPesquisa = [];
                    //adicionar aqui

                    projetosInvestigacao.forEach((projetos, index) => {
                        if (projetos.dataFim != 0) {
                            projetos.podeAlterar = true;
                            novosProjetosPesquisa.push(projetos);
                        }
                    });
                    trabalhos.trabalhosDePesquisaForProfessorHistorico = novosProjetosPesquisa;
                }
            });
        };

        if (sessionStorage.getItem('E-Teacher User Email') !== null) {

            if (sessionStorage.getItem('E-Teacher User Tipo') !== "alunos" && sessionStorage.getItem('E-Teacher User Tipo') != "admin") {

                trabalhos.profileEmail = sessionStorage.getItem('E-Teacher User Email');

                const promiseGetAreaDoProfessor = AllUsersService.getProfile(trabalhos.profileEmail, "professores");
                promiseGetAreaDoProfessor.then((response) => {
                    trabalhos.idArea = response.data.professores[0].idArea;
                    if (trabalhos.idArea === "") {
                        trabalhos.idArea = 0;
                    }
                    const promiseGetArea = AllAreasService.getArea(trabalhos.idArea);
                    promiseGetArea.then((response) => {
                        trabalhos.cor = response.data.areas[0].cor;
                    });
                });


                const promiseGetTrabalhos = AllTrabalhosService.getTrabalhosFrom(trabalhos.profileEmail);
                promiseGetTrabalhos.then((response) => {
                    trabalhos.trabalhosForProfessor = response.data.professores[0].trabalhos;
                    trabalhos.trabalhosForProfessor.forEach((AllTrabalhos, index) => {
                        trabalhos.trabalhosForProfessor[index].podeAlterar = true;
                    });
                }).catch((error) => {
                    console.log(error);
                });

                const promiseGetProjetosDeInvestigacaoAtuais = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
                promiseGetProjetosDeInvestigacaoAtuais.then((response) => {
                    if (response.data.info != "Não existe nenhum professor com esse email!") {
                        let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                        let novosProjetosPesquisa = [];
                        //adicionar aqui

                        projetosInvestigacao.forEach((projetos, index) => {
                            if (projetos.dataFim == 0) {
                                if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                                    projetos.dataFim = "até o momento";
                                } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                                    projetos.dataFim = "at the moment";
                                }
                                projetos.podeAlterar = true;
                                novosProjetosPesquisa.push(projetos);
                            }
                        });
                        trabalhos.trabalhosDePesquisaForProfessorAtuais = novosProjetosPesquisa;
                    }
                });

                const promiseGetProjetosDeInvestigacaoHistorico = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
                promiseGetProjetosDeInvestigacaoHistorico.then((response) => {
                    if (response.data.info != "Não existe nenhum professor com esse email!") {
                        let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                        let novosProjetosPesquisa = [];
                        //adicionar aqui

                        projetosInvestigacao.forEach((projetos, index) => {
                            if (projetos.dataFim != 0) {
                                projetos.podeAlterar = true;
                                novosProjetosPesquisa.push(projetos);
                            }
                        });
                        trabalhos.trabalhosDePesquisaForProfessorHistorico = novosProjetosPesquisa;
                    }
                });


            }



            const promiseAllStudents = AllUsersService.getAllUsers("alunos");
            promiseAllStudents.then((response) => {
                trabalhos.allStudents = response.data.alunos;
            });

            trabalhos.createProject = (novoProjetoBruto) => {
                const novoProjeto = JSON.parse(novoProjetoBruto);
                let existe = false;
                trabalhos.trabalhosForProfessor.forEach((element, index) => {
                    if (novoProjeto.idTrabalho === element.idTrabalho) {
                        existe = true;
                    }
                });
                if (!existe) {
                    novoProjeto.podeAlterar = true;
                    trabalhos.trabalhosForProfessor.push(novoProjeto);
                    document.getElementById("divErroCreateProject").style.display = "none";
                    document.getElementById("closeAlterarPerfil").click();
                } else {
                    //caso já exista
                    document.getElementById("divErroCreateProject").style.display = "block";
                    if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                        document.getElementById("mensagemDeErroCreateProject").innerText = "Id do projeto já existente!";
                    } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                        document.getElementById("mensagemDeErroCreateProject").innerText = "Project id already exists!";
                    }

                }

                $scope.$apply();
                return existe;
            };

            trabalhos.ReloadResearchProject = () => {
                const promiseGetProjetosDeInvestigacaoAtuaisNoReload = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
                promiseGetProjetosDeInvestigacaoAtuaisNoReload.then((response) => {
                    if (response.data.info != "Não existe nenhum professor com esse email!") {
                        let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                        let novosProjetosPesquisa = [];
                        //adicionar aqui

                        projetosInvestigacao.forEach((projetos, index) => {
                            if (projetos.dataFim == 0) {
                                if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                                    projetos.dataFim = "até o momento";
                                } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                                    projetos.dataFim = "at the moment";
                                }
                                projetos.podeAlterar = true;
                                novosProjetosPesquisa.push(projetos);
                            }
                        });
                        trabalhos.trabalhosDePesquisaForProfessorAtuais = novosProjetosPesquisa;
                    }
                });

                const promiseGetProjetosDeInvestigacaoHistoricoNoReload = AllTrabalhosService.getProjetosDeInvestigacaoFrom(trabalhos.profileEmail);
                promiseGetProjetosDeInvestigacaoHistoricoNoReload.then((response) => {
                    if (response.data.info != "Não existe nenhum professor com esse email!") {
                        let projetosInvestigacao = response.data.professores[0].projetosInvestigacao;
                        let novosProjetosPesquisa = [];
                        //adicionar aqui

                        projetosInvestigacao.forEach((projetos, index) => {
                            if (projetos.dataFim != 0) {
                                projetos.podeAlterar = true;
                                novosProjetosPesquisa.push(projetos);
                            }
                        });
                        trabalhos.trabalhosDePesquisaForProfessorHistorico = novosProjetosPesquisa;
                    }
                });

                $scope.$apply();
            };

            trabalhos.alterarTrabalho = (bodyBruto) => {
                const body = JSON.parse(bodyBruto);
                const idTrabalho = body.idTrabalho;
                const novoNome = body.nome;
                const novoCodigo = body.codigo;
                const novaImagem = body.imagem;
                const novaInfo = body.info;
                const novaNota = body.nota;
                const novoRelatorio = body.relatorio;
                const novoResumo = body.resumo;
                trabalhos.trabalhosForProfessor.forEach((element, index) => {
                    if (element.idTrabalho === idTrabalho) {
                        element.imagem = novaImagem;
                        element.nome = novoNome;
                        element.codigo = novoCodigo;
                        element.informacao = novaInfo;
                        element.nota = novaNota;
                        element.relatorio = novoRelatorio;
                        element.resumo = novoResumo;
                    }
                });

                $scope.$apply();
            };

            trabalhos.reloadProjetos = () => {
                const promiseGetTrabalhos = AllTrabalhosService.getTrabalhosFrom(trabalhos.profileEmail);
                promiseGetTrabalhos.then((response) => {
                    trabalhos.trabalhosForProfessor = response.data.professores[0].trabalhos;
                    trabalhos.trabalhosForProfessor.forEach((AllTrabalhos, index) => {
                        trabalhos.trabalhosForProfessor[index].podeAlterar = true;
                    });
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                }).catch((error) => {
                    console.log(error);
                });
            };

            trabalhos.removerTrabalho = (idTrabalho) => {
                trabalhos.trabalhosForProfessor.forEach((element, index) => {
                    if (element.idTrabalho === idTrabalho) {
                        trabalhos.trabalhosForProfessor.splice(index, 1);
                    }
                });
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };


            trabalhos.addAlunoAoTrabalho = (alunoEmail) => {
                const idTrabalho = sessionStorage.getItem("E-Teacher User idTrabalho");
                trabalhos.trabalhosForProfessor.forEach((element, index) => {
                    if (element.idTrabalho === idTrabalho) {
                        let existe = false;
                        element.alunos.forEach((element2, index2) => {
                            if (element2.email === alunoEmail) {
                                existe = true;
                            }
                        });
                        if (!existe) {
                            const promiseAlunoNovo = AllUsersService.getProfile(alunoEmail, "alunos");
                            promiseAlunoNovo.then((response) => {
                                trabalhos.trabalhosForProfessor[index].alunos.push({ "email": response.data.alunos[0].email, "nome": response.data.alunos[0].nome, "numero": response.data.alunos[0].numeroDeAluno });
                                openNotification("Aluno adicionado com sucesso!", "Student successfully added!");
                            });
                            document.getElementById("divErroAddAluno").style.display = "none";
                            document.getElementById("mensagemDeErroAddAluno").innerText = "";
                        } else {
                            document.getElementById("divErroAddAluno").style.display = "block";
                            if (sessionStorage.getItem("E-Teacher Idioma") === "pt") {
                                document.getElementById("mensagemDeErroAddAluno").innerText = "Aluno já existente no projeto!";
                            } else if (sessionStorage.getItem("E-Teacher Idioma") === "en") {
                                document.getElementById("mensagemDeErroAddAluno").innerText = "Student already in this project!";
                            }
                        }


                    }

                });
            };

            trabalhos.eliminarAlunoDoTrabalho = (idTrabalho, alunoEmail) => {
                trabalhos.trabalhosForProfessor.forEach((element, index) => {
                    if (element.idTrabalho === idTrabalho) {
                        element.alunos.forEach((element2, index2) => {
                            if (element2.email === alunoEmail) {
                                element.alunos.splice(index2, 1);
                            }
                        });
                    }
                });
            };


        }

    }



    AllUsersService.$inject = ['$http', 'ApiBasePath'];
    function AllUsersService($http, ApiBasePath) {
        const userService = this;

        userService.getAllUsers = (tipo) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/" + tipo),
                withCredentials: true
            });
            return response;
        };
        userService.getProfile = (email, tipo) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/" + tipo + "/" + email),
                withCredentials: true
            });
            return response;
        }
    }

    AllInstituicoesService.$inject = ['$http', 'ApiBasePath'];
    function AllInstituicoesService($http, ApiBasePath) {
        const instituicoesService = this;

        instituicoesService.getAllInstituicoes = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/instituicao"),
                withCredentials: true
            });
            return response;
        };

        instituicoesService.getInstituicao = (idInstituicao) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/instituicao/" + idInstituicao),
                withCredentials: true
            });
            return response;
        }
    }


    AllDisciplinasService.$inject = ['$http', 'ApiBasePath'];
    function AllDisciplinasService($http, ApiBasePath) {
        const disciplinasService = this;

        disciplinasService.getAllDisciplinasFromATeacher = (email) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/professoresDisciplinas/" + email),
                withCredentials: true
            });
            return response;
        };

        disciplinasService.getAllDisciplinas = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/disciplinas"),
                withCredentials: true
            });
            return response;
        };


        disciplinasService.getDisciplina = (idDisciplinas) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/disciplinas/" + idDisciplinas),
                withCredentials: true
            });
            return response;
        };
    }


    AllStudentsOfTeachersService.$inject = ['$http', 'ApiBasePath'];
    function AllStudentsOfTeachersService($http, ApiBasePath) {
        const studentOfTeacher = this;

        studentOfTeacher.getAllStudentsOfAllTeachers = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/professoresAlunos"),
                withCredentials: true
            });
            return response;
        };
        studentOfTeacher.getAllStudentsOfATeacher = (email) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/professoresAlunos/" + email),
                withCredentials: true
            });
            return response;
        }

        studentOfTeacher.getAllTeachersOfAllStudent = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/alunosProfessores"),
                withCredentials: true
            });
            return response;
        }

        studentOfTeacher.getAllTeachersOfAStudent = (email) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/alunosProfessores/" + email),
                withCredentials: true
            });
            return response;
        }
    }



    AllTrabalhosService.$inject = ['$http', 'ApiBasePath'];
    function AllTrabalhosService($http, ApiBasePath) {
        const trabalhosService = this;

        trabalhosService.getAllTrabalhos = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/trabalhos"),
                withCredentials: true
            });
            return response;
        };
        trabalhosService.getTrabalhosFrom = (email) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/trabalhos/" + email),
                withCredentials: true
            });
            return response;
        }



        trabalhosService.getAllProjetosDeInvestigacao = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/projetosInvestigacao"),
                withCredentials: true
            });
            return response;
        };

        trabalhosService.getProjetosDeInvestigacaoFrom = (email) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/projetosInvestigacao/" + email),
                withCredentials: true
            });
            return response;
        }


    }


    AllAreasService.$inject = ['$http', 'ApiBasePath'];
    function AllAreasService($http, ApiBasePath) {
        const areaService = this;

        areaService.getAllAreas = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/areas"),
                withCredentials: true
            });
            return response;
        };
        areaService.getArea = (nome) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/areas/" + nome),
                withCredentials: true
            });
            return response;
        }
    }


    AllOrientacoesService.$inject = ['$http', 'ApiBasePath'];
    function AllOrientacoesService($http, ApiBasePath) {
        const orientacoesService = this;

        orientacoesService.getAllOrientacoes = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/orientacoes"),
                withCredentials: true
            });
            return response;
        };
        orientacoesService.getOrientacoesDoProfessor = (email) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/orientacoes/" + email),
                withCredentials: true
            });
            return response;
        }
    }


    AllRecursosDigitaisService.$inject = ['$http', 'ApiBasePath'];
    function AllRecursosDigitaisService($http, ApiBasePath) {
        const recursosDigitaisService = this;

        recursosDigitaisService.getAllRecursosDigitais = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/recursosDigitais"),
                withCredentials: true
            });
            return response;
        };
        recursosDigitaisService.getRecursosDigitaisDoProfessor = (email) => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/recursosDigitais/" + email),
                withCredentials: true
            });
            return response;
        }
    }

    AllLogsService.$inject = ['$http', 'ApiBasePath'];
    function AllLogsService($http, ApiBasePath) {
        const logsService = this;

        logsService.getAllLogs = () => {
            const response = $http({
                method: "GET",
                url: (ApiBasePath + "/logsAdmin/1/2"),
                withCredentials: true
            });
            return response;
        };
    }


})();