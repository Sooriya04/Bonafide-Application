const ExcelJS = require('exceljs');

async function generateBonafideExcel(filePath, start, end, data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Bonafide Report');

  // Main title
  worksheet.mergeCells('A1:M1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'Monthly Bonafide Report';
  titleCell.alignment = { horizontal: 'center' };
  titleCell.font = { size: 16, bold: true };

  // Date range
  worksheet.mergeCells('A2:M2');
  const dateCell = worksheet.getCell('A2');
  dateCell.value = `Report for: ${start.toLocaleDateString(
    'en-GB'
  )} - ${end.toLocaleDateString('en-GB')}`;
  dateCell.alignment = { horizontal: 'center' };
  dateCell.font = { size: 12 };

  // Define columns WITHOUT headers
  worksheet.columns = [
    { key: 'sno', width: 6 },
    { key: 'title', width: 10 },
    { key: 'name', width: 20 },
    { key: 'rollno', width: 12 },
    { key: 'relation', width: 15 },
    { key: 'parentName', width: 20 },
    { key: 'year', width: 10 },
    { key: 'course', width: 12 },
    { key: 'branch', width: 15 },
    { key: 'certificateFor', width: 20 },
    { key: 'scholarshipType', width: 20 },
    { key: 'date', width: 15 },
    { key: 'academicYear', width: 15 },
  ];

  // Add header row (row 3)
  const headerRow = worksheet.addRow({
    sno: 'S.No',
    title: 'Title',
    name: 'Name',
    rollno: 'Roll No',
    relation: 'Relation',
    parentName: 'Parent Name',
    year: 'Year',
    course: 'Course',
    branch: 'Branch',
    certificateFor: 'Certificate For',
    scholarshipType: 'Scholarship Type',
    date: 'Date',
    academicYear: 'Academic Year',
  });

  // Style header row
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: 'center' };

  // Add data rows
  data.forEach((entry, idx) => {
    worksheet.addRow({
      sno: idx + 1,
      title: entry.title || '',
      name: entry.name || '',
      rollno: entry.rollno || '',
      relation: entry.relation || '',
      parentName: entry.parentName || '',
      year: entry.year || '',
      course: entry.course || '',
      branch: entry.branch || '',
      certificateFor: entry.certificateFor || '',
      scholarshipType: entry.scholarshipType || '',
      date: entry.date
        ? typeof entry.date === 'string'
          ? entry.date
          : entry.date.toDate().toISOString().split('T')[0]
        : '',
      academicYear: entry.academicYear || '',
    });
  });

  // Apply borders to all cells with data
  const rowCount = worksheet.rowCount;
  for (let i = 1; i <= rowCount; i++) {
    const row = worksheet.getRow(i);
    for (let j = 1; j <= 13; j++) {
      // A to M columns
      const cell = row.getCell(j);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }
  }

  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { generateBonafideExcel };
