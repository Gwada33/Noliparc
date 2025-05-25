"use client";

import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await emailjs.send(
        "service_xxxxxx", // Remplace par ton service ID
        "template_xxxxxx", // Remplace par ton template ID
        data,
        "publicKey_xxxxxx" // Remplace par ta clé publique
      );
      setSuccess(true);
      reset();
    } catch (error) {
      alert("Erreur lors de l'envoi. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Contacte-nous</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Nom</label>
        <input {...register("name", { required: true })} placeholder="Votre nom" />
        {errors.name && <span>Ce champ est requis</span>}

        <label>Email</label>
        <input {...register("email", { required: true })} type="email" placeholder="Votre email" />
        {errors.email && <span>Email invalide</span>}

        <label>Message</label>
        <textarea {...register("message", { required: true })} placeholder="Votre message" />
        {errors.message && <span>Ce champ est requis</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      {success && <p className="success">Message envoyé avec succès 🎉</p>}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 60px auto;
          font-family: sans-serif;
          padding: 1rem;
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-top: 1rem;
        }
        input, textarea {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-top: 0.3rem;
        }
        textarea {
          height: 120px;
        }
        button {
          margin-top: 1.5rem;
          padding: 0.7rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background: #aaa;
        }
        .success {
          margin-top: 1rem;
          color: green;
          text-align: center;
        }
        span {
          color: red;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
