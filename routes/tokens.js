import jwt from 'jwt-simple';

module.exports = app => {
    const cfg = app.libs.config;
    const Users = app.db.models.Users;

    /**
     * @api {post} /token Token autenticado
     * @apiGroup Credencial
     * @apiParam {String} email Email de usuário
     * @apiParam {String} password Senha de usuário
     * @apiParamExample {json} Entrada
     *  {
     *      "email": "john@connor.net",
     *      "password": "123456"
     *  }
     * @apiSuccess {String} token Token de usuário autenticado
     * @apiSuccessExample {json} Sucesso
     *  HTTP/1.1 200 OK
     *  {"token": "xyz.abc.123.hgf"}
     * @apiErrorExample {json} Erro de autenticação
     * HTTP/1.1 401 Unathorized
     */
    app.post('/token', async (req, res) => {
        const { email, password } = req.body
        if (email && password) {
            try {
                const user = await Users.findOne({where: { email }})
                if (Users.isPassword(user.password, password)) {
                    const payload = { id: user.id };
                    res.json({ token: jwt.encode(payload, cfg.jwtSecret) })
                } else {
                    res.sendStatus(401);
                }
            } catch(e) {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    })
}