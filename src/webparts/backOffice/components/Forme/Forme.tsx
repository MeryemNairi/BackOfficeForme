import * as React from 'react';
import { IFormProps, IFormData } from './IFormProps';
import { submitForm, getFormData, updateFormEntry, deleteFormEntry } from './FormeService';
import styles from './Forme.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export const Forme: React.FC<IFormProps> = ({ context }) => {
  const [formData, setFormData] = React.useState<IFormData>({
    id: 0,
    offre_title: '',
    short_description: '',
    deadline: new Date(),
    city: 'rabat',
    fileType: 'pdf',
    file: null,
    fileName: '',
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
    if (name === 'deadline') {
      // Conversion de la date en format ISO
      const date = new Date(value);
      setFormData(prevState => ({
        ...prevState,
        [name]: date, // Assurez-vous de passer l'objet Date ici
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
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
      if (formData.id) {
        await updateFormEntry(formData.id, formData);
      } else {
        await submitForm(formData);
      }
      setFormData({
        id: 0,
        offre_title: '',
        short_description: '',
        deadline: new Date(),
        city: 'rabat',
        fileType: 'pdf',
        file: null,
        fileName: '',
      });
      alert('Form submitted successfully!');
      fetchFormData();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };

  const handleEditEntry = (entry: IFormData) => {
    setFormData(entry);
  };

  const handleDeleteEntry = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteFormEntry(id);
        alert('Form entry deleted successfully!');
        fetchFormData();
      } catch (error) {
        console.error('Error deleting form entry:', error);
        alert('An error occurred while deleting the form entry. Please try again.');
      }
    }
  };

  return (
    <div className={styles.backOfficeContainer}>
      <h2>Back Office</h2>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.inputField}>
          <label htmlFor="offre_title">Offre Title:</label>
          <input type="text" id="offre_title" name="offre_title" value={formData.offre_title} onChange={handleInputChange} required />
        </div>
        <div className={styles.inputField}>
          <label htmlFor="short_description">Short Description:</label>
          <input type="text" id="short_description" name="short_description" value={formData.short_description} onChange={handleInputChange} required />
        </div>
        <div className={styles.inputField}>
          <label htmlFor="deadline">Deadline:</label>
          <input type="date" id="deadline" name="deadline" value={formData.deadline.toISOString().split('T')[0]} onChange={handleInputChange} required />
        </div>
        <div className={styles.inputField}>
          <label htmlFor="city">City:</label>
          <select name="city" value={formData.city} onChange={handleInputChange} required>
            <option value="rabat">Rabat</option>
            <option value="fes">Fes</option>
            <option value="rabat&fes">Rabat & Fes</option>
          </select>
        </div>
        <div className={styles.inputField}>
          <label>File Type:</label>
          <select name="fileType" value={formData.fileType} onChange={handleInputChange} required>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        <div className={styles.inputField}>
          <label>Upload File:</label>
          <input type="file" accept=".pdf,.docx,.xlsx" onChange={handleFileChange} required />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      <h3>Internal Recrutements</h3>
      <table>
        <thead>
          <tr>
            <th>Offre Title</th>
            <th>Short Description</th>
            <th>Deadline</th>
            <th>City</th>
            <th>File Type</th>
            <th>File </th>
            <th>Action</th>
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
              <td>
                {entry.fileUrl ? (
                  <span
                    style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}
                    onClick={() => window.open(entry.fileUrl, '_blank')}
                  >
                    fichier
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <button onClick={() => handleEditEntry(entry)}>Update</button>
                <span className={styles.iconSpace}></span>
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteEntry(entry.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Forme;
