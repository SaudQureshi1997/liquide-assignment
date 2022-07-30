import guest from "#middlewares/guest.js";
import { login, refreshToken, register } from "#handlers/auth.js";
import auth from "#middlewares/auth.js";
import { store, index, show } from "#handlers/trade.js";

const routes = [
    {
        methods: ['POST'],
        path: '/auth/register',
        middlewares: [guest],
        handler: register
    },
    {
        methods: ['POST'],
        path: '/auth/login',
        middlewares: [guest],
        handler: login
    },
    {
        methods: ['POST'],
        path: '/auth/refresh',
        middlewares: [],
        handler: refreshToken
    },
    {
        methods: ['GET'],
        path: '/trades',
        middlewares: [auth],
        handler: index
    },
    {
        methods: ['POST'],
        path: '/trades',
        middlewares: [auth],
        handler: store
    },
    {
        methods: ['GET'],
        path: '/trades/:id',
        middlewares: [auth],
        handler: show
    }
];

export default routes;