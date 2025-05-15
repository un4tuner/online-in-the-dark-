import Sheet from './sheet';

export interface WorldIllustration {
  id: string;
  filename: string;
  originalname: string;
  uploadedAt: string;
  description?: string;
}

export interface WorldBook {
  id: string;
  filename: string;
  originalname: string;
  uploadedAt: string;
  description?: string;
}

export class World extends Sheet {
  sheetType = 'world';
  worldType: 'book' | 'illustration' = 'illustration';
  name: string = 'World';
  description: string = '';
  header: string = '';
  comments: string = '';
  illustrations: WorldIllustration[] = [];
  books: WorldBook[] = [];

  constructor() {
    super();
    this.sheetType = 'world';
  }
} 