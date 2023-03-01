import { Request, Response } from 'express';
import IMatchesService from '../interfaces/IMatchesService';

class MatchesController {
  private _service: IMatchesService;

  constructor(service: IMatchesService) {
    this._service = service;
  }

  findAll = async (req: Request, res: Response) => {
    const result = await this._service.findAll();
    return res.status(200).json(result);
  };
}

export default MatchesController;
