const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const bodyParser = require('koa-better-body');

const projectsDB = require('./knex/data/projects');
const projectStatsDB = require('./knex/data/projectStats');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
    try {
        await next();
    }

    catch (err) {
        ctx.status = 500;
        ctx.message = err.message || 'Sorry, an error has occurred.';
    }
});

app.use(serve(__dirname + '/www'));

const router = new Router();

router.get('/api/project/:id', async (ctx) => {
    const projectStats = await projectStatsDB.byProjectId(ctx.params.id);
    ctx.body = projectStats;
});

router.get('/api/projects', async (ctx) => {
    const allProjects = await projectsDB.getAll();
    ctx.body = allProjects;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
console.log('running')