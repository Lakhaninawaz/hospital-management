const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const createBillPdf = ({ appointment, patientName, doctorName, amount }) => {
  return new Promise((resolve, reject) => {
    const filename = `bill-${appointment._id}.pdf`;
    const relativePath = `/uploads/bills/${filename}`;
    const filePath = path.join(__dirname, "../../uploads/bills", filename);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(22).text("Hospital Bill", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Appointment ID: ${appointment._id}`);
    doc.text(`Patient Name: ${patientName}`);
    doc.text(`Doctor Name: ${doctorName}`);
    doc.text(`Date: ${new Date(appointment.date).toLocaleString()}`);
    doc.moveDown();
    doc.text("Consultation Fee: Rs. 500");
    doc.text("Prescription Handling: Rs. 150");
    doc.text(`Total Amount: Rs. ${amount}`);
    doc.moveDown();
    doc.text("Thank you for visiting our hospital.");

    doc.end();

    stream.on("finish", () => resolve(relativePath));
    stream.on("error", reject);
  });
};

module.exports = createBillPdf;
