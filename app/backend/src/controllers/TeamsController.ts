import { Request, Response } from 'express';
import ITeamsServices from '../interfaces/ITeamsServices';

class TeamsController {
  private _service: ITeamsServices;

  constructor(service: ITeamsServices) {
    this._service = service;
  }

  findAll = async (req: Request, res: Response) => {
    const result = await this._service.findAll();
    return res.status(200).json(result);
  };

  findById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await this._service.findById(id);

    if (result) return res.status(200).json(result);
  };
}

export default TeamsController;
