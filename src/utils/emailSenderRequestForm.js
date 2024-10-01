// src/utils/emailSenderRequestForm.js
export const sendRequestFormEmail = async (formData) => {
    try {
        const response = await fetch('https://email-server-eta-taupe.vercel.app/send-email', { // Updated URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;
    }
};
