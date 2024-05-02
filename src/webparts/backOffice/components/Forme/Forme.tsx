import * as React from 'react';
import { IFormProps, IFormData } from './IFormProps';
import { submitForm, getFormData, updateFormEntry, deleteFormEntry } from './FormeService';
import styles from './Forme.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { AiOutlineFile } from 'react-icons/ai';



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
    <div className={styles.backOfficeContainer} style={{ position: 'relative' }}>

      <div style={{ display: 'flex', alignItems: 'center' }}>

        <svg
          width="60%"
          height="60%"
          viewBox="0 0 526 525"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: '20px' }}
        >
          <rect x="350" width="175" height="175" rx="87.5" fill="#00AB84" />
          <rect y="350" width="175" height="175" rx="87.5" fill="#00AB84" />
          <rect x="176" y="175" width="175" height="175" rx="87.5" fill="#00AB84" />
          <path d="M175 0H350V175C253.35 175 175 96.6498 175 0Z" fill="#FEE45E" />
          <path d="M175 175L175.152 350L0.15168 350.152C0.0679441 253.502 78.3502 175.084 175 175Z" fill="#FEE45E" />
          <path d="M350 175H525V350C428.35 350 350 271.65 350 175Z" fill="#002920" />
          <path d="M524.922 524.078L349.922 523.921L350.079 348.921C446.729 349.008 525.009 427.429 524.922 524.078Z" fill="#002920" />
          <rect width="175" height="175" fill="#002920" />
          <path d="M351 524L175 349V524H351Z" fill="#FFC46B" />
        </svg>
        <div>
          <h2 style={{ fontFamily: 'Montserrat', fontSize: '40px', fontWeight: 600, lineHeight: '97.52px', textAlign: 'left', marginBottom: '10px' }}>Gestion des Offres d'Emploi</h2>
          <p style={{ fontFamily: 'Montserrat', fontSize: '16px' }}>Bienvenue sur notre plateforme de gestion des offres d'emploi. Ici, vous pouvez facilement saisir, modifier et gérer toutes les offres d'emploi que votre entreprise propose.

          </p>
        </div>
      </div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <div className={styles.inputField}>
          <h3 className={styles.inlineTitle}>Offre Title:</h3>
          <input type="text" id="offre_title" name="offre_title" value={formData.offre_title} onChange={handleInputChange} className={styles.OffreTitle} />
        </div>
        <div className={styles.inputField}>
          <h3 className={styles.inlineTitle}>Short Description:</h3>
          <input type="text" id="short_description" name="short_description" value={formData.short_description} onChange={handleInputChange} className={styles.ShortDescription} />
        </div>
        <div className={styles.inputField}>
          <h3 className={styles.inlineTitle}>Deadline:</h3>
          <input type="date" id="deadline" name="deadline" value={formData.deadline.toISOString().split('T')[0]} onChange={handleInputChange} required />
        </div>
        <div className={styles.inputField}>
          <h3 className={styles.inlineTitle}>City:</h3>
          <select name="city" value={formData.city} onChange={handleInputChange} required>
            <option value="rabat">Rabat</option>
            <option value="fes">Fes</option>
            <option value="rabat&fes">Rabat & Fes</option>
          </select>
        </div>
        <div className={styles.inputField}>
          <h3 className={styles.inlineTitle}>File Type:</h3>
          <select name="fileType" value={formData.fileType} onChange={handleInputChange} required>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>
        <div className={styles.inputField}>
          <h3 className={styles.inlineTitle}>Upload File:</h3>
          <input type="file" accept=".pdf,.docx,.xlsx" onChange={handleFileChange} required />
        </div>
        <div>
          <button type="submit" className={styles.button}>Submit</button>
        </div>
      </form>

      <h2>Internal Recruitments</h2>
      <table>
        <thead>
          <tr>
            <th>Offre Title</th>
            <th>Short Description</th>
            <th>Deadline</th>
            <th>City</th>
            <th>File Type</th>
            <th>FileName</th>
            <th>File</th>
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
                  <p>
                    {entry.fileUrl.substring(entry.fileUrl.lastIndexOf('/') + 1)}
                  </p>
                ) : (
                  '-'
                )}
              </td>
              <td>
                {entry.fileUrl ? (
                  <span
                    style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }}
                    onClick={() => window.open(entry.fileUrl, '_blank')}>
                    <AiOutlineFile style={{ marginRight: '5px' }} />
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <FontAwesomeIcon icon={faEdit} onClick={() => handleEditEntry(entry)} style={{ color: 'blue', cursor: 'pointer' }} />
                <span className={styles.iconSpace}></span>
                <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteEntry(entry.id)} style={{ color: 'black', cursor: 'pointer' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

};

export default Forme;
