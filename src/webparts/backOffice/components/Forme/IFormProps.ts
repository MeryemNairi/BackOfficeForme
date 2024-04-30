import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IFormData {
  id: number; 
  offre_title: string;
  short_description: string;
  deadline: Date;
  city: 'rabat' | 'fes' | 'rabat&fes';
  fileType: 'pdf' | 'docx' | 'xlsx';
  file: File | null;
  fileUrl?: string;
  fileName: string; 

}



export interface IFormProps {
  context: WebPartContext;
}
