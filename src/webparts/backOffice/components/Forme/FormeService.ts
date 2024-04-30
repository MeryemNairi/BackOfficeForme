import { sp } from '@pnp/sp';
import { IFormData } from './IFormProps';

export const submitForm = async (formData: IFormData) => {
  try {
    // Upload file to "Assets" document library
    const fileItem = await sp.web.lists.getByTitle('BackOfficeV0').rootFolder.files.add(formData.file!.name, formData.file!, true);
    const fileUrl = fileItem.data.ServerRelativeUrl;

    // Store form data in SharePoint list
    const list = sp.web.lists.getByTitle('BackOfficeV1');
    await list.items.add({
      offre_title: formData.offre_title, 
      short_description: formData.short_description, 
      deadline: formData.deadline, 
      city: formData.city, 
      fileType: formData.fileType, 
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('An error occurred while submitting the form. Please try again.');
  }
};

export const getFormData = async (): Promise<IFormData[]> => {
    try {
        const list = sp.web.lists.getByTitle('BackOfficeV1');
        const items = await list.items.select('Id', 'offre_title', 'short_description', 'deadline', 'city', 'fileType').get();
        return items.map((item: any) => ({
            id: item.Id, // Ajoutez l'ID
            offre_title: item.offre_title,
            short_description: item.short_description,
            deadline: new Date(item.deadline),
            city: item.city,
            fileType: item.fileType,
            file: null, // Ajoutez une valeur par défaut pour file
            fileUrl: '', // Ajoutez une valeur par défaut pour fileUrl
        }));
    } catch (error) {
        console.error('Error fetching form data:', error);
        throw new Error('An error occurred while fetching form data. Please try again.');
    }
};

