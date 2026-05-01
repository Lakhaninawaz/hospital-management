const PDFDocument = require("pdfkit");

const createBillPdf = ({ appointment, patientName, doctorName, amount }) => {
  return new Promise((resolve, reject) => {
    const buffers = [];

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    const pageW = doc.page.width;   // 595
    const L = 50;                   // left margin
    const R = pageW - 50;           // right margin
    const contentW = R - L;         // 495

    // ── HEADER ──────────────────────────────────────────────
    doc
      .rect(L, 40, contentW, 70)
      .fillAndStroke("#1e40af", "#1e40af");

    doc
      .fillColor("#ffffff")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("CAREPOINT HOSPITAL", L, 52, { width: contentW, align: "center" });

    doc
      .fontSize(9)
      .font("Helvetica")
      .text("Quality Care for Better Health", L, 76, { width: contentW, align: "center" });

    doc
      .fontSize(8)
      .text(
        "123 Medical Avenue, City   |   1-800-HOSPITAL   |   billing@carepoint.com",
        L, 90, { width: contentW, align: "center" }
      );

    // ── INVOICE TITLE BAR ────────────────────────────────────
    doc
      .rect(L, 120, contentW, 24)
      .fillAndStroke("#e8f0fe", "#1e40af");

    doc
      .fillColor("#1e40af")
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("INVOICE", L, 126, { width: contentW, align: "center" });

    // ── INVOICE META (two-column) ────────────────────────────
    let y = 158;
    const col1 = L;
    const col2 = L + contentW / 2 + 20;

    doc.fillColor("#333333").fontSize(9).font("Helvetica-Bold");
    doc.text("Invoice No:", col1, y);
    doc.text("Bill Date:", col1, y + 16);
    doc.text("Bill Time:", col1, y + 32);

    doc.font("Helvetica").fillColor("#000000");
    doc.text(`INV-${appointment._id.toString().slice(-8).toUpperCase()}`, col1 + 80, y);
    doc.text(new Date(appointment.date).toLocaleDateString(), col1 + 80, y + 16);
    doc.text(new Date(appointment.date).toLocaleTimeString(), col1 + 80, y + 32);

    // ── DIVIDER ──────────────────────────────────────────────
    y += 54;
    doc.strokeColor("#cccccc").lineWidth(0.8).moveTo(L, y).lineTo(R, y).stroke();

    // ── PATIENT & DOCTOR INFO (two-column) ───────────────────
    y += 12;
    const infoBoxH = 68;

    // Patient box
    doc.rect(col1, y, contentW / 2 - 8, infoBoxH).fillAndStroke("#f8faff", "#dde6ff");
    doc.fillColor("#1e40af").fontSize(8).font("Helvetica-Bold")
       .text("PATIENT INFORMATION", col1 + 8, y + 8);
    doc.fillColor("#000000").fontSize(9).font("Helvetica")
       .text(`Name:`, col1 + 8, y + 22)
       .text(patientName, col1 + 55, y + 22)
       .text(`Appt ID:`, col1 + 8, y + 38)
       .text(appointment._id.toString().slice(-10).toUpperCase(), col1 + 55, y + 38);

    // Doctor box
    const dCol = col1 + contentW / 2 + 8;
    const dW = contentW / 2 - 8;
    doc.rect(dCol, y, dW, infoBoxH).fillAndStroke("#f8faff", "#dde6ff");
    doc.fillColor("#1e40af").fontSize(8).font("Helvetica-Bold")
       .text("DOCTOR INFORMATION", dCol + 8, y + 8);
    doc.fillColor("#000000").fontSize(9).font("Helvetica")
       .text(`Doctor:`, dCol + 8, y + 22)
       .text(doctorName, dCol + 55, y + 22)
       .text(`Specialty:`, dCol + 8, y + 38)
       .text(appointment.doctorId?.specialization || "General", dCol + 55, y + 38);

    // ── TABLE ────────────────────────────────────────────────
    y += infoBoxH + 18;

    const tDesc  = L;
    const tQty   = L + 240;
    const tUnit  = L + 320;
    const tAmt   = L + 410;
    const tEnd   = R;
    const rowH   = 26;

    // Table header
    doc.rect(tDesc, y, tEnd - tDesc, rowH).fillAndStroke("#1e40af", "#1e40af");
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
    doc.text("Description",  tDesc + 8,  y + 8, { width: 220 });
    doc.text("Qty",          tQty  + 4,  y + 8, { width: 70, align: "center" });
    doc.text("Unit Price",   tUnit + 4,  y + 8, { width: 80, align: "right" });
    doc.text("Amount",       tAmt  + 4,  y + 8, { width: tEnd - tAmt - 8, align: "right" });

    // Helper: draw one table row
    const drawRow = (label, qty, unitPrice, rowAmt, rowY, shade) => {
      doc.rect(tDesc, rowY, tEnd - tDesc, rowH)
         .fillAndStroke(shade ? "#f0f4ff" : "#ffffff", "#dde6ff");
      doc.fillColor("#000000").fontSize(9).font("Helvetica");
      doc.text(label,          tDesc + 8,  rowY + 8, { width: 220 });
      doc.text(String(qty),    tQty  + 4,  rowY + 8, { width: 70,  align: "center" });
      doc.text(`Rs. ${unitPrice}`, tUnit + 4, rowY + 8, { width: 80,  align: "right" });
      doc.text(`Rs. ${rowAmt}`,    tAmt  + 4, rowY + 8, { width: tEnd - tAmt - 8, align: "right" });
    };

    const consultationFee  = 500;
    const prescriptionFee  = 150;

    drawRow("Consultation Fee",      1, consultationFee, consultationFee, y + rowH,     false);
    drawRow("Prescription Handling", 1, prescriptionFee, prescriptionFee, y + rowH * 2, true);

    // ── TOTALS ───────────────────────────────────────────────
    y += rowH * 3 + 10;

    const sumLabelX = tUnit + 4;
    const sumValX   = tAmt  + 4;
    const sumValW   = tEnd - tAmt - 8;

    doc.fillColor("#333333").fontSize(9).font("Helvetica");
    doc.text("Subtotal:",  sumLabelX, y,      { width: 80, align: "right" });
    doc.text(`Rs. ${amount}`, sumValX, y,     { width: sumValW, align: "right" });

    doc.text("Tax (0%):",  sumLabelX, y + 16, { width: 80, align: "right" });
    doc.text("Rs. 0",      sumValX,   y + 16, { width: sumValW, align: "right" });

    y += 36;
    doc.rect(tUnit, y, tEnd - tUnit, 26).fillAndStroke("#1e40af", "#1e40af");
    doc.fillColor("#ffffff").fontSize(10).font("Helvetica-Bold");
    doc.text("TOTAL:",         sumLabelX, y + 7, { width: 80,      align: "right" });
    doc.text(`Rs. ${amount}`,  sumValX,   y + 7, { width: sumValW, align: "right" });

    // ── PAYMENT TERMS ────────────────────────────────────────
    y += 42;
    doc.rect(L, y, contentW, 44).fillAndStroke("#fffbeb", "#fcd34d");
    doc.fillColor("#92400e").fontSize(8).font("Helvetica-Bold")
       .text("Payment Terms", L + 10, y + 8);
    doc.fillColor("#333333").font("Helvetica")
       .text("Payment due within 7 days of invoice date.", L + 10, y + 20)
       .text("Please make payment to: Healthcare Hospital Account", L + 10, y + 32);

    // ── FOOTER ───────────────────────────────────────────────
    y += 60;
    doc.strokeColor("#cccccc").lineWidth(0.5).moveTo(L, y).lineTo(R, y).stroke();
    y += 8;

    doc.fillColor("#666666").fontSize(8).font("Helvetica")
       .text(
         "Thank you for choosing Healthcare Hospital. We appreciate your trust in our services.",
         L, y, { width: contentW, align: "center" }
       )
       .text(
         "This is an electronically generated invoice. No signature required.",
         L, y + 12, { width: contentW, align: "center" }
       )
       .text(
         "© 2025 Healthcare Hospital. All rights reserved.",
         L, y + 26, { width: contentW, align: "center" }
       );

    doc.end();
  });
};

module.exports = createBillPdf;