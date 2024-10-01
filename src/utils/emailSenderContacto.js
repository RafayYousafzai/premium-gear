import emailjs from 'emailjs-com';

export const sendContactFormEmail = (templateParams) => {
    return emailjs.send('service_gigx00c', 'template_gliqotd', templateParams, '8hSA9xtY_MD2aRQHn');
};
