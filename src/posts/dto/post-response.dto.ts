import { Category } from '../entities/category.entity';

export class PostResponse {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public user: {
      id: number;
      email: string;
    },
    public createdAt: Date,
    public updatedAt: Date,
    public categories: Category[],
  ) {}
}
