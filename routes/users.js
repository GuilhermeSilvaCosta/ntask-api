module.exports = app => {
    const { Users } = app.db.models;

    app.route('/user')
    .all(app.auth.authenticate())
    /**
     * @api {get} /user Exibe usuário autenticado
     * @apiGroup Usuário
     * @apiHeader {String} Authorization Token de usuário
     * @apiHeaderExample {json} Header
     *  {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiSuccess {Number} id Id de registro
     * @apiSuccess {String} name Nome
     * @apiSuccess {String} email Email
     * @apiSuccessExample {json} Sucesso
     *  HTTP/1.1 200 ok
     *  {
     *      "id": 1,
     *      "name": "John Connor",
     *      "email": "john@connor.net"
     *  }
     * @apiErrorExample {json} Erro de consulta
     *  HTTP/1.1 412 Precondition Failed
     */
    .get(async (req, res) => {
        try {
            const result = await Users.findByPk(req.user.id, {attributes: ['id', 'name', 'email']});
            res.json(result);
        } catch(e) {
            res.status(412).json({msg: e.message});
        }       
    })
    /**
     * @api {delete} /user Exclui usuário autenticado
     * @apiGroup Usuário
     * @apiHeader {String} Authorization Token de usuário
     * @apiHeaderExample {json} Header
     *  {"Authorization": "JWT xyz.abc.123.hgf"}
     * @apiSuccessExample {json} Sucesso
     *  HTTP/1.1 204 No Content
     * @apiErrorExample {json} Erro na exclusão
     *  HTTP/1.1 412 Precondition Failed
     */
    .delete(async (req, res) => {
        try {
            await Users.destroy({where: {id: req.user.id}});
            res.sendStatus(204);
        } catch(e) {
            res.status(412).json({msg: e.message})
        }
    })
    /**
     * @api {post} /users Cadastra novo usuário
     * @apiGroup Usuário
     * @apiParam {String} name Nome
     * @apiParam {String} email Email
     * @apiParam {String} password Senha
     * @apiParamExample {json} Entrada
     *  {
     *      "name": "John Connor",
     *      "email": "john@connor.net",
     *      "password": "123456"
     *  }
     * @apiSuccess {Number} id Id de registro
     * @apiSuccess {String} name Name
     * @apiSuccess {String} email Email
     * @apiSuccess {String} password Senha criptografada
     * @apiSuccess {Date} updated_at Data de atualização
     * @apiSuccess {Date} created_at Data de cadastro
     * @apiSuccessExample {json} Sucesso
     *  HTTP/1.1 200 OK
     *  {
     *      "id": 1,
     *      "name": "John Connor",
     *      "email": "john@connor.net",
     *      "password": "$2a$10$SK1B1",
     *      "updated_at": "2015-09-24T15:46:51.778Z",
     *      "created_at": "2015-09-24T15:46:51.778Z"
     *  }
     * @apiErrorExample {json} Erro no cadastro
     *  HTTP/1.1 412 Precondition Failed
     */
    app.post('/users', async (req, res) => {
        try {
            const response = await Users.create(req.body);
            res.json(response);
        } catch(e) {
            res.status(412).json({msg: e.message});
        }
    })
}