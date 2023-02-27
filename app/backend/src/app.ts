import * as express from 'express';
// import teamsRoutes from './routes/teamsRoutes';

// import { Router } from 'express';
import TeamsService from './services/TeamsService';
import TeamsController from './controllers/TeamsController';

// const teamsRoutes = Router();
const teamService = new TeamsService();
const teamsController = new TeamsController(teamService);

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
    this.app.get('/teams', teamsController.findAll);
    // this.initRoutes();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  // private initRoutes(): void {
  //   this.app.use('/teams', teamsRoutes);
  // }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
