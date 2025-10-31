import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";
import "../assets/styles/Contacts.css";

export default function Contacts() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const language = "pt"; // <-- aqui você escolhe "pt" ou "en"

  const texts = {
    pt: {
      title: "Fale Comigo",
      subtitle: "Adoraria ouvir você! 🚀",
      description: "Se tiver ideias, dúvidas ou apenas quiser trocar uma ideia, estou por aqui.",
      placeholders: {
        name: "Digite seu nome",
        email: "Digite seu email",
        message: "Digite sua mensagem",
      },
      button: "Mandar mensagem",
      success: "Uhuu! Mensagem enviada com sucesso 😎",
      error: "Ops! Não consegui enviar: ",
      whatsapp: "Conversar no WhatsApp",
    },
    en: {
      title: "Get in Touch",
      subtitle: "I'd love to hear from you! 🚀",
      description: "If you have ideas, questions, or just want to chat, I'm here.",
      placeholders: {
        name: "Enter your name",
        email: "Enter your email",
        message: "Enter your message",
      },
      button: "Send Message",
      success: "Yay! Message sent successfully 😎",
      error: "Oops! Couldn't send: ",
      whatsapp: "Chat on WhatsApp",
    },
  };

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm(
          "service_3i6ae1d",
          "template_6h51b6u",
          form.current,
          "CLbOD3U-NJTIdep-Q"
        )
        .then(
          () => {
            form.current?.reset();
            setStatus(texts[language].success);
          },
          (error) => {
            setStatus(texts[language].error + error.text);
          }
        );
    }
  };

  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    const phoneNumber = "5534999999999"; // Substitua pelo seu número
    const message = "Olá Victor! Gostaria de conversar sobre...";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contacts">
      <h1 className="contacts-title">{texts[language].title}</h1>

      <div className="contact-card big two-columns">
        <div className="contact-left">
          <h2>{texts[language].subtitle}</h2>
          <p>{texts[language].description}</p>

          <div className="social-icons">
            <a
              href="https://www.linkedin.com/in/v%C3%ADctor-gabriel-cruz-pereira-927a84243/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
            >
              <FaLinkedin className="social linkedin" />
            </a>
            <a
              href="https://github.com/Victorgabrielcruz"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
            >
              <FaGithub className="social github" />
            </a>
            <button
              onClick={openWhatsApp}
              className="social whatsapp-btn"
              title={texts[language].whatsapp}
            >
              <FaWhatsapp className="social whatsapp" />
            </button>
          </div>

          {/* Botão WhatsApp para mobile */}
          <button 
            onClick={openWhatsApp}
            className="whatsapp-mobile-btn"
          >
            <FaWhatsapp className="whatsapp-icon" />
            {texts[language].whatsapp}
          </button>
        </div>

        <div className="contact-right">
          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder={texts[language].placeholders.name}
              required
            />
            <input
              type="email"
              name="email"
              placeholder={texts[language].placeholders.email}
              required
            />
            <textarea
              name="message"
              rows={5}
              placeholder={texts[language].placeholders.message}
              required
            />
            <button type="submit" className="contact-btn">
              {texts[language].button}
            </button>
          </form>
          {status && <p className="form-status">{status}</p>}
        </div>
      </div>
    </div>
  );
}