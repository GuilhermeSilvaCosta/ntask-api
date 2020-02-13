import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

module.exports = app => {
    const Users = app.db.models.Users;
    const cfg = app.libs.config;
    const strategy = new Strategy({jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'), secretOrKey: cfg.jwtSecret},
        async (payload, done) => {
            try {
                const user = await Users.findByPk(payload.id);
                if (user) {
                    return done(null, {
                        id: user.id,
                        email: user.email
                    });
                }
                return done(null, false)
            } catch (e) {
                done(e, null);
            }
            
        });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize()
        },
        authenticate: () => {
            return passport.authenticate('jwt', cfg.jwtSession)
        }
    }
}