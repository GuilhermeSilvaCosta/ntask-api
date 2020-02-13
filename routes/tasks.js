module.exports = app => {
    const { Tasks } = app.db.models;
    app.route('/tasks')
        .all(app.auth.authenticate())
        /**
         * @api {get} /tasks Lista de tarefas
         * @apiGroup Tarefas
         * @apiHeader {String} Authorization Token de usuário
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT xyz.abc.123.hfg"}
         * @apiSuccess {Object[]} tasks Lista de tarefas
         * @apiSuccess {Number} tasks.id Id de registro
         * @apiSuccess {String} tasks.title Titulo da tarefa
         * @apiSuccess {Boolean} tasks.done Tarefa foi concluída
         * @apiSuccess {Date} tasks.updated_at Data de atualização
         * @apiSuccess {Date} tasks.created_at Data de cadastro
         * @apiSuccess {Number} tasks.user_id Id do usuário
         * @apiSuccessExample {json} Sucesso
         *  HTTP/1.1 200 OK
         *  [{
         *      "id": 1,
         *      "title": "Estudar",
         *      "done": false,
         *      "updated_at": "2015-09-24T15:46:51.778Z",
         *      "created_at": "2015-09-24T15:46:51.778Z",
         *      "user_id": 1
         *  }]
         * @apiErrorExample {json} Erro de consulta
         *  HTTP/1.1 412 Precondition Failed
         */
        .get(async (req, res) => {
            try {
                const tasks = await Tasks.findAll({where: {user_id: req.user.id}});
                res.json(tasks);
            } catch(e) {
                res.status(412).json({msg: e.message})
            }
        })
        /**
         * @api {post} /tasks Cadastra uma tarefa
         * @apiGroup Tarefas
         * @apiHeader {String} Authorization Token de usuário
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT xyz.abc.123.hgf"}
         * @apiParam {String} title Título da tarefa
         * @apiParamExample {json} Entrada
         *  {"title": "Estudar"}
         * @apiSuccess {Number} id Id de registro
         * @apiSuccess {String} title Título da tarefa
         * @apiSuccess {Boolean} done-false Tarefa foi concluída?
         * @apiSuccess {Date} updated_at Data de atualização
         * @apiSuccess {Date} created_at Data de cadastro
         * @apiSuccess {Number} user_id Id do usuário
         * @apiSucceddExample {json} Sucesso
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "title": "Estudar",
         *      "done": false,
         *      "updated_at": "2015-09-24T15:46:51.778Z",
         *      "created_at": "2015-09-24T15:46:51.778Z",
         *      "user_id": 1
         *  }
         * @apiErrorExample {json} Erro de consulta
         *  HTTP/1.1 412 Precondition Failed
         */
        .post(async (req, res) => {
            req.body.user_id = req.user.id;
            try {
                const result = await Tasks.create(req.body);
                res.json(result);
            } catch(e) {
                res.status(412).json({msg: e.message})
            }            
        });
    
    app.route('/tasks/:id')
        .all(app.auth.authenticate())
        /**
         * @api {get} /tasks/:id Exibe uma tarefa
         * @apiGroup Tarefas
         * @apiHeader {String} Authorization Token de usuário
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT xyz.abc.123.hgf"}
         * @apiParam {String} title Título da tarefa
         * @apiParamExample {json} Entrada
         *  {"title": "Estudar"}
         * @apiSuccess {Number} id Id de registro
         * @apiParamExample {json} Entrada
         *  {"title": "Estudar"}
         * @apiSuccess {Number} id Id de registro
         * @apiSuccess {String} title Título da tarefa
         * @apiSuccess {Boolean} done-false Tarefa foi concluída?
         * @apiSuccess {Date} updatet_at Data de atualização
         * @apiSuccess {Date} created_at Data de cadastro
         * @apiSuccess {Number} user_id Id do usuário
         * @apiSuccessExample {json} Sucesso
         *  HTTP/1.1 200 OK
         *  {
         *      "id": 1,
         *      "title": "Estudar",
         *      "done": false,
         *      "updated_at": "2015-09-24T15:46:51.778Z",
         *      "created_at": "2015-09-24T15:46:51.778Z",
         *      "user_id": 1
         *  }
         * @apiErroExample {json} Erro de consulta
         *  HTTP/1.1 412 Precondition Failed
         */
        .get(async (req, res) => {
            try {
                const result = await Tasks.findOne({where: {id: req.params.id, user_id: req.user.id}})
                if (result) {
                    res.json(result);
                } else {
                    res.sendStatus(404);
                }
            } catch(e) {
                res.status(412).json({msg: e.message});
            }
        })
        /**
         * @api {put} /tasks/:id Atualiza uma tarefa
         * @apiGroup Tarefas
         * @apiHeader {String} Authorization Token de usuário
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT xyz.abc.123.hgf"}
         * @apiParam {id} id Id da tarefa
         * @apiParam {String} title Título da tarefa
         * @apiParam {Boolean} done Tarefa foi conluída?
         * @apiParamExample {json} Entrada
         *  {
         *      "title": "Trabalhar",
         *      "done": true
         *  }
         * @apiSuccessExample {json} Sucesso
         *  HTTP/1.1 204 No Content
         * @apiErrorExample {json} Erro de consulta
         *  HTTP/1.1 412 Precondition Failed
         */ 
        .put(async (req, res) => {
            try {
                await Tasks.update(req.body, {where: {id: req.params.id, user_id: req.user.id}});
                res.sendStatus(204);
            } catch (e) {
                res.status(412).json({msg: e.message})
            }
        })
        /**
         * @api {delete} /tasks/:id Exclui um tarefa
         * @apiGroup Tarefas
         * @apiHeader {String} Authorization Token de usuário
         * @apiHeaderExample {json} Header
         *  {"Authorization": "JWT xyz.abc.123.hgf"}
         * @apiParam {id} id Id da tarefa
         * @apiSuccessExample {json} Sucesso
         *  HTTP/1.1 204 No Content
         * @apiErroExample {json} Erro de consulta
         *  HTTP/1.1 412 Precondition Failed
         */
        .delete(async (req, res) => {
            try {
                await Tasks.destroy({where: {id: req.params.id, user_id: req.user.id}})
                res.sendStatus(204);
            } catch(e) {
                res.status(412).json({msg: e.message})
            }
        });
};