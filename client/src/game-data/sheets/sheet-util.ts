import sheetImages from '@/assets/data/sheet-images.json';
import { createCharacterTemplates } from './character-sheet';
import { createCrewTemplates } from './crew-sheet';
import { createScoreTemplates } from './score-sheet';

export function createTemplates(sheetType: string) {
  if (sheetType === 'crew') return createCrewTemplates();
  if (sheetType === 'character') return createCharacterTemplates();
  if (sheetType === 'score') return createScoreTemplates();
  return {};
}

export function getSheetImage(imageId: string) {
  return sheetImages.find((image) => image.id === imageId);
}
