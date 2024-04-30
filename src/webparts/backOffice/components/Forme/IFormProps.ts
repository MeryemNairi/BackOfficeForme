import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IFormData {
  offre_title: string;
  short_description: string;
  deadline: Date;
  city: 'rabat' | 'fes' | 'rabat&fes';
  fileType: 'pdf' | 'docx' | 'xlsx';
  file: File | null;
  fileUrl?: string; // Rendre fileUrl facultatif en ajoutant '?'
}


export interface IFormProps {
  context: WebPartContext;
}
