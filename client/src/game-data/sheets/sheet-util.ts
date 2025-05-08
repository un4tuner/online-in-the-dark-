import sheetImages from '@/assets/data/sheet-images.json';
import { createCharacterTemplates } from './character-sheet';
import { createCrewTemplates } from './crew-sheet';

export function createTemplates(sheetType: string) {
  if (sheetType === 'crew') return createCrewTemplates();
  if (sheetType === 'character') return createCharacterTemplates();
  return {};
}

export function getSheetImage(imageId: string) {
  return sheetImages.find((image) => image.id === imageId);
}
