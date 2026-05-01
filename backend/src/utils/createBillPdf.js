const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const createBillPdf = ({ appointment, patientName, doctorName, amount }) => {
  return new Promise((resolve, reject) => {
    const filename = `bill-${appointment._id}.pdf`;
    const relativePath = `/uploads/bills/${filename}`;
    const filePath = path.join(__dirname, "../../uploads/bills", filename);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.dirname(filePath);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Hospital Header
    doc.fontSize(20).font("Helvetica-Bold").text("HEALTHCARE HOSPITAL", { align: "center" });
    doc.fontSize(10).font("Helvetica").text("Quality Care for Better Health", { align: "center" });
    doc.fontSize(9).fillColor("#666666").text("📍 123 Medical Avenue, City | 📞 1-800-HOSPITAL | 📧 billing@healthcare.com", { align: "center" });
    doc.moveDown(0.5);
    
    // Horizontal line
    doc.strokeColor("#000000").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.5);

    // Invoice Title and Details
    doc.fontSize(14).font("Helvetica-Bold").fillColor("#000000").text("INVOICE", { align: "left" });
    doc.fontSize(10).font("Helvetica");
    
    const invoiceDetailsY = doc.y;
    doc.text(`Invoice No: INV-${appointment._id.toString().slice(-8).toUpperCase()}`, 40, invoiceDetailsY);
    doc.text(`Bill Date: ${new Date(appointment.date).toLocaleDateString()}`, 40, invoiceDetailsY + 15);
    doc.text(`Bill Time: ${new Date(appointment.date).toLocaleTimeString()}`, 40, invoiceDetailsY + 30);

    doc.moveDown(2.5);

    // Patient and Doctor Information
    doc.font("Helvetica-Bold").fontSize(10).text("PATIENT INFORMATION", { underline: true });
    doc.font("Helvetica").fontSize(9);
    doc.text(`Name: ${patientName}`);
    doc.text(`Appointment ID: ${appointment._id}`);
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").fontSize(10).text("DOCTOR INFORMATION", { underline: true });
    doc.font("Helvetica").fontSize(9);
    doc.text(`Doctor: ${doctorName}`);
    doc.text(`Specialization: ${appointment.doctorId?.specialization || "General"}`);
    doc.moveDown(1);

    // Items Table
    const tableTop = doc.y;
    const col1X = 40;
    const col2X = 320;
    const col3X = 430;
    const col4X = 520;
    const rowHeight = 25;

    // Table Header
    doc.rect(col1X, tableTop, 515, rowHeight).fillAndStroke("#1e40af", "#000000");
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
    doc.text("Description", col1X + 10, tableTop + 5);
    doc.text("Quantity", col2X + 10, tableTop + 5);
    doc.text("Unit Price", col3X + 10, tableTop + 5);
    doc.text("Amount", col4X + 10, tableTop + 5);

    // Table Items
    doc.fillColor("#000000").font("Helvetica");
    let currentY = tableTop + rowHeight;

    // Item 1: Consultation Fee
    const consultationFee = 500;
    doc.rect(col1X, currentY, 515, rowHeight).stroke("#cccccc");
    doc.fontSize(9).text("Consultation Fee", col1X + 10, currentY + 5);
    doc.text("1", col2X + 50, currentY + 5);
    doc.text(`Rs. ${consultationFee}`, col3X + 10, currentY + 5);
    doc.text(`Rs. ${consultationFee}`, col4X + 10, currentY + 5);
    currentY += rowHeight;

    // Item 2: Prescription Handling
    const prescriptionFee = 150;
    doc.rect(col1X, currentY, 515, rowHeight).stroke("#cccccc");
    doc.text("Prescription Handling", col1X + 10, currentY + 5);
    doc.text("1", col2X + 50, currentY + 5);
    doc.text(`Rs. ${prescriptionFee}`, col3X + 10, currentY + 5);
    doc.text(`Rs. ${prescriptionFee}`, col4X + 10, currentY + 5);
    currentY += rowHeight;

    doc.moveDown(0.5);

    // Summary Section
    const summaryX = col3X - 20;
    doc.font("Helvetica").fontSize(10);
    doc.text("Subtotal:", summaryX, doc.y);
    doc.text(`Rs. ${amount}`, col4X + 10, doc.y - 15);
    
    doc.moveDown(0.5);
    
    doc.text("Tax (0%):", summaryX, doc.y);
    doc.text("Rs. 0", col4X + 10, doc.y - 15);
    
    doc.moveDown(0.8);

    // Total
    doc.rect(summaryX - 10, doc.y - 5, 180, 25).fillAndStroke("#1e40af");
    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(11);
    doc.text("TOTAL AMOUNT:", summaryX, doc.y + 3);
    doc.text(`Rs. ${amount}`, col4X + 10, doc.y - 15);

    doc.moveDown(1.5);

    // Payment Terms
    doc.fillColor("#000000").font("Helvetica-Bold").fontSize(9).text("Payment Terms:", { underline: true });
    doc.font("Helvetica").fontSize(8).fillColor("#666666");
    doc.text("Payment due within 7 days of invoice date.");
    doc.text("Please make payment to: Healthcare Hospital Account");
    doc.moveDown(0.8);

    // Footer
    doc.fontSize(8).fillColor("#666666");
    doc.text("Thank you for choosing Healthcare Hospital. We appreciate your trust in our services.", { align: "center" });
    doc.text("This is an electronically generated invoice. No signature required.", { align: "center" });
    
    // Footer line
    doc.moveDown(0.5);
    doc.strokeColor("#999999").lineWidth(0.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    
    doc.fontSize(8).text("© 2025 Healthcare Hospital. All rights reserved.", { align: "center" });

    doc.end();

    stream.on("finish", () => resolve(relativePath));
    stream.on("error", reject);
  });
};

module.exports = createBillPdf;
