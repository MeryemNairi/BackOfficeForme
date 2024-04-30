import * as React from 'react';
import { IFormProps, IFormData } from './IFormProps';
import { submitForm, getFormData } from './FormeService';

export const Forme: React.FC<IFormProps> = ({ context }) => {
  const [formData, setFormData] = React.useState<IFormData>({
    offre_title: '',
    short_description: '',
    deadline: new Date(),
    city: 'rabat',
    fileType: 'pdf',
    file: null,
  });

  const [formEntries, setFormEntries] = React.useState<IFormData[]>([]);

  React.useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const formData = await getFormData();
      setFormEntries(formData);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData(prevState => ({
        ...prevState,
        file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      
      await submitForm(formData);
      setFormData({
        offre_title: '',
        short_description: '',
        deadline: new Date(),
        city: 'rabat',
        fileType: 'pdf',
        file: null,
      });
      alert('Form submitted successfully!');
      fetchFormData(); // Rafraîchir les données après la soumission du formulaire
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="offre_title">Offre Title:</label>
          <input type="text" id="offre_title" name="offre_title" value={formData.offre_title} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="short_description">Short Description:</label>
          <input type="text" id="short_description" name="short_description" value={formData.short_description} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input type="date" id="deadline" name="deadline" value={formData.deadline.toISOString().split('T')[0]} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <select name="city" value={formData.city} onChange={handleInputChange} required>
            <option value="rabat">Rabat</option>
            <option value="fes">Fes</option>
            <option value="rabat&fes">Rabat & Fes</option>
          </select>
        </div>
        <div>
          <label>File Type:</label>
          <select name="fileType" value={formData.fileType} onChange={handleInputChange} required>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        <div>
          <label>Upload File:</label>
          <input type="file" accept=".pdf,.docx,.xlsx" onChange={handleFileChange} required />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
  
      <h2>Form Entries:</h2>
      <table>
        <thead>
          <tr>
            <th>Offre Title</th>
            <th>Short Description</th>
            <th>Deadline</th>
            <th>City</th>
            <th>File Type</th>
          </tr>
        </thead>
        <tbody>
          {formEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.offre_title}</td>
              <td>{entry.short_description}</td>
              <td>{entry.deadline.toLocaleDateString()}</td>
              <td>{entry.city}</td>
              <td>{entry.fileType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default Forme;
