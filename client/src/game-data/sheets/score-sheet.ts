// filepath: src/game-data/sheets/score-sheet.ts
import { Clock, Effectable, Item, Person } from '../game-data-types';
import Sheet from './sheet';


export class Score extends Sheet {
  ui: { [key: string]: boolean } = {};

  //scoreType: { id: string; name: string; description: string; quantity: number; maxQuantity: number; }[] = []; // The type of score this is (e.g. score, world, etc.)
  scoreName: string = 'Score Name'; 
  scoreTypeDescription: string = '';
  image: string = '/images/cover-images/default-score-image.png';
  scoreDescription: string = '';
  name: string = 'New Score';
  notes: string = 'These are default notes.';
  scoreType: string = ''; // The type of score this is (e.g. score, world, etc.)
   

//  contacts: Person[] = [];
 // contactsLabel: string = 'Key Personas';

  //stress: number = 0; // 0-9
  //maxStress: number = 9;

  tierLevel: number = 0;

  progressClock: Clock = {
    id: 'progress',
    name: 'Progress',
    description:
      'Progress clocks are used to track the progress of a task or goal.',
    segments: 4,
    value: 0
  };


  constructor() {
    super();
    this.sheetType = 'score';
    
  }
}

export class Heist extends Score {
  constructor() {
    super();
    this.name = 'Heist';
    this.scoreType = 'Heist';
    this.scoreDescription = 'A heist is a planned robbery or theft.';
    this.image = 'e52f27b1-e5f6-42de-9889-c2d9aeeb3b0d';
  } 
}

export class Assault extends Score {
  constructor() {
    super();
    this.name = 'Assault';
    this.scoreType = 'Assault'; // The type of score this is (e.g. score, world, etc.)
    this.scoreDescription = 'An assault is a violent attack.';
    this.image = 'e52f27b1-e5f6-42de-9889-c2d9aeeb3b0d';
  }  
}

export class Sabotage extends Score { 
  constructor() {
    super();  
    this.name = 'Sabotage'; 
    this.scoreType = 'Sabotage'; // The type of score this is (e.g. score, world, etc.)
    this.scoreDescription = 'Sabotage is the act of deliberately destroying or damaging something.';
    this.image = 'e52f27b1-e5f6-42de-9889-c2d9aeeb3b0d';
  }
}

export class Smuggling extends Score {
  constructor() {
    super(); 
    this.name = 'Smuggling'; 
    this.scoreType = 'Smuggling'; // The type of score this is (e.g. score, world, etc.)
    this.scoreDescription = 'Smuggling is the illegal transportation of goods.';
    this.image = 'e52f27b1-e5f6-42de-9889-c2d9aeeb3b0d';
  } 
}

export class Occult extends Score {
  constructor() {
    super(); 
    this.name = 'Occult';
    this.scoreType = 'Occult'; // The type of score this is (e.g. score, world, etc.)  
    this.scoreDescription = 'Occult refers to supernatural, mystical, or magical beliefs.';
    this.image = 'e52f27b1-e5f6-42de-9889-c2d9aeeb3b0d';
  }
}






export function createScoreTemplates() {
  return {
    Score: new Score(),  };
}
