const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

function sanitizeForDocx(value) {
  if (value === undefined || value === null) return '';
  return String(value);
}

async function generateBonafideDocx(formData) {
  try {
    const templatePath = path.resolve(__dirname, '../templates/Bonafide_Certificate.docx');
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found at: ${templatePath}`);
    }

    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    

    const formattedScholarshipType = formData.scholarshipType ? ` (${formData.scholarshipType})` : '';

    const data = {
      title: sanitizeForDocx(formData.title),
      name: sanitizeForDocx(formData.name),
      rollno: sanitizeForDocx(formData.rollno),
      relation: sanitizeForDocx(formData.relation),
      parentName: sanitizeForDocx(formData.parentName),
      year: sanitizeForDocx(formData.year),
      course: sanitizeForDocx(formData.course),
      branch: sanitizeForDocx(formData.branch),
      certificateFor: sanitizeForDocx(formData.certificateFor),
      scholarshipType: formattedScholarshipType,
      date: sanitizeForDocx(formData.date),
      academicYear: sanitizeForDocx(formData.academicYear),
      himHer: sanitizeForDocx(formData.himHer || 'him/her')
    };

    console.log('Generated data with himHer:', data.himHer);

    const doc = new Docxtemplater(zip, { 
      paragraphLoop: true, 
      linebreaks: true,
      nullGetter: () => ''
    });
    
    // NEW SYNTAX: Use render() instead of setData()
    doc.render(data);

    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    return buf;
  } catch (error) {
    console.error('Error in generateBonafideDocx:', error);
    
    if (error.properties && error.properties.errors instanceof Array) {
      error.properties.errors.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, {
          id: err.properties.id,
          explanation: err.properties.explanation,
          context: err.properties.context,
          file: err.properties.file
        });
      });
      
      const friendlyError = new Error('Template syntax error. Please check that all placeholders use {variable} format.');
      friendlyError.originalError = error;
      throw friendlyError;
    }
    
    throw error;
  }
}

module.exports = generateBonafideDocx;