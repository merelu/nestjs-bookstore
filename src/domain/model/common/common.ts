export interface ICommonModel {
  id: number;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date;
}

export class CommonModel implements ICommonModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
