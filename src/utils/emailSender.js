import emailjs from 'emailjs-com';

export const sendEmail = async ({ to, subject, html, sender, attachment, vehicle, userData, orderNumber }) => {
    try {
        const templateParams = {
            to_email: to,
            from_name: sender,
            subject,
            message_html: html,
            vehicle_brand: vehicle.brand,
            vehicle_name: vehicle.name,
            vehicle_year: vehicle.year,
            vehicle_mileage: vehicle.mileage,
            user_name: userData.name,
            user_phone: userData.phone,
            order_number: orderNumber,
            reservation_price: vehicle.reservationPrice,
            total_price: vehicle.price,
            invoice_link: attachment, // Use the URL from Firebase
        };

        console.log('Email parameters:', templateParams); // Log the email parameters

        await emailjs.send('service_gigx00c', 'template_rva1dd2', templateParams, '8hSA9xtY_MD2aRQHn');
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error('Failed to send email');
    }
};
