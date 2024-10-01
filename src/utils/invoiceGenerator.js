import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export const generateInvoicePdf = async ({
  vehicle,
  userData,
  orderNumber,
  totalPrice,
  reservationPrice,
}) => {
  const doc = new jsPDF();

  // Set colors
  const primaryColor = "#3498db";
  const secondaryColor = "#2c3e50";

  // Add background color
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, 210, 297, "F");

  // Add header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  // Add Invoice heading and Order Number
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("INVOICE", 20, 25);

  doc.setFontSize(12);
  doc.setTextColor(secondaryColor);
  doc.text(`Order Number: ${orderNumber}`, 20, 50);

  // Fetch and add Company Logo
  const logoUrl = `${window.location.origin}/assets/logo.png`;
  const logoImage = await fetch(logoUrl)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );

  doc.addImage(logoImage, "PNG", 150, 10, 40, 20);

  // Bill To Section
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.text("Bill To:", 20, 70);
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor);
  doc.setFont("helvetica", "normal");
  doc.text(`${userData.name || ""}`, 20, 80);
  doc.text(`${userData.address || ""}`, 20, 85);
  doc.text(`${userData.city || ""}, ${userData.zipCode || ""}`, 20, 90);
  doc.text(`${userData.country || ""}`, 20, 95);
  doc.text(`Phone: ${userData.phone || ""}`, 20, 100);
  doc.text(`Email: ${userData.email || ""}`, 20, 105);

  // Bill From Section
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Bill From:", 120, 70);
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Gear", 120, 80);
  doc.text("1234 Elm Street", 120, 85);
  doc.text("Metropolis, 54321", 120, 90);
  doc.text("Neverland", 120, 95);
  doc.text("Phone: (123) 456-7890", 120, 100);
  doc.text("Email: info@premiumgear.com", 120, 105);

  // Vehicle Information Table
  doc.autoTable({
    startY: 120,
    head: [["Brand", "Model", "Year", "Mileage (km)", "Reservation Cost"]],
    body: [
      [
        vehicle.brand,
        vehicle.name,
        vehicle.year,
        `${vehicle.mileage} km`,
        `€${reservationPrice}`,
      ],
    ],
    headStyles: { fillColor: primaryColor, textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    columnStyles: { 4: { halign: "right" } },
  });

  // Amount Due
  const finalY = doc.lastAutoTable.finalY || 120;
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount Due: €${reservationPrice}`, 130, finalY + 20);

  // Bank Information
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.text("Bank Information:", 20, finalY + 40);
  doc.setFontSize(12);
  doc.setTextColor(secondaryColor);
  doc.setFont("helvetica", "normal");
  doc.text("Bank Name: Your Bank", 20, finalY + 50);
  doc.text("Account Holder: Premium Gear", 20, finalY + 55);
  doc.text("IBAN: DE89370400440532013000", 20, finalY + 60);
  doc.text("SWIFT/BIC: COBADEFFXXX", 20, finalY + 65);

  // Footer
  doc.setFillColor(primaryColor);
  doc.rect(0, 277, 210, 20, "F");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Thank you for your business!", 105, 288, { align: "center" });

  // Generate and upload PDF
  const pdfData = doc.output("datauristring");
  const storage = getStorage();
  const storageRef = ref(storage, `invoices/${orderNumber}.pdf`);
  await uploadString(storageRef, pdfData, "data_url");

  const downloadURL = await getDownloadURL(storageRef);
  console.log("Generated invoice download URL:", downloadURL);
  return downloadURL;
};
