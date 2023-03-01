import { Request, Response } from 'express';
import IMatchesService from '../interfaces/IMatchesService';

class MatchesController {
  private _service: IMatchesService;

  constructor(service: IMatchesService) {
    this._service = service;
  }

  findAll = async (req: Request, res: Response) => {
    const result = await this._service.findAll();

    if (req.query.inProgress) {
      const filteredResult = result
        .filter((match) => match.inProgress.toString() === req.query.inProgress);
      return res.status(200).json(filteredResult);
    }
    return res.status(200).json(result);
  };

  finishMatch = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this._service.finishMatch(id);
    return res.status(200).json({ message: 'Finished' });
  };

  updateMatch = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { homeTeamGoals, awayTeamGoals } = req.body;

    await this._service.updateMatch(id, homeTeamGoals, awayTeamGoals);
    return res.status(200).json({ message: `Match ${id} updated!` });
  };

  createMatch = async (req: Request, res: Response) => {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

    const result = await this._service
      .createMatch(homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals);
    return res.status(201).json(result);
  };
}

export default MatchesController;
