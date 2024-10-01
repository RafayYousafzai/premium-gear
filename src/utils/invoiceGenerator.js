import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

export const generateInvoicePdf = async ({ vehicle, userData, orderNumber, totalPrice, reservationPrice }) => {
    const doc = new jsPDF();

    // Add Invoice heading and Order Number
    doc.setFontSize(20);
    doc.text('Invoice', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Order Number: ${orderNumber}`, 20, 30);

    // Fetch and add Company Logo on the opposite side with proper sizing
    const logoUrl = `${window.location.origin}/assets/logo.png`;  // Path relative to the public folder
    const logoImage = await fetch(logoUrl).then(res => res.blob()).then(blob => new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    }));

    doc.addImage(logoImage, 'PNG', 140, 10, 40, 20); // Adjusted the size to avoid stretching

    // Bill To Section on the left
    doc.setFontSize(12);
    doc.text('Bill To:', 20, 60);
    doc.text(`Name: ${userData.name || ''}`, 20, 70);
    doc.text(`Address: ${userData.address || ''}`, 20, 80);  
    doc.text(`City: ${userData.city || ''}, ${userData.zipCode || ''}`, 20, 90);
    doc.text(`${userData.country || ''}`, 20, 100);
    doc.text(`Phone: ${userData.phone || ''}`, 20, 110);
    doc.text(`Email: ${userData.email || ''}`, 20, 120);

    // Bill From Section on the right (with dummy data)
    doc.text('Bill From:', 140, 60);
    doc.text('Premium Gear', 140, 70);
    doc.text('Address: 1234 Elm Street', 140, 80);  // Dummy address
    doc.text('Metropolis, 54321', 140, 90);  // Dummy city and zip code
    doc.text('Neverland', 140, 100);  // Dummy country
    doc.text('Phone: (123) 456-7890', 140, 110);
    doc.text('Email: info@premiumgear.com', 140, 120);

    // Vehicle Information Table
    doc.autoTable({
        startY: 140,
        head: [['Brand', 'Model', 'Year', 'Mileage (km)', 'Reservation Cost']],
        body: [
            [vehicle.brand, vehicle.name, vehicle.year, `${vehicle.mileage} km`, `€${reservationPrice}`]
        ],
    });

    // Amount Due
    doc.setFontSize(12);
    doc.text(`Total Amount Due: €${reservationPrice}`, 140, 160);

    // Bank Information
    doc.text('Bank Information:', 20, 180);
    doc.text('Bank Name: Your Bank', 20, 190);
    doc.text('Account Holder: Premium Gear', 20, 200);
    doc.text('IBAN: DE89370400440532013000', 20, 210);
    doc.text('SWIFT/BIC: COBADEFFXXX', 20, 220);

    // Generate and upload PDF
    const pdfData = doc.output('datauristring');
    const storage = getStorage();
    const storageRef = ref(storage, `invoices/${orderNumber}.pdf`);
    await uploadString(storageRef, pdfData, 'data_url');

    const downloadURL = await getDownloadURL(storageRef);
    console.log('Generated invoice download URL:', downloadURL);
    return downloadURL;
};
