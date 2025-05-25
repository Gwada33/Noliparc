import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

type ReservationData = {
  nom: string;
  email: string;
  date: string;
};

const Reservation: React.FC = () => {
  const { register, handleSubmit } = useForm<ReservationData>();

  const onSubmit = async (data: ReservationData) => {
    try {
      const response = await axios.post("/api/reservation", data);
      alert("Réservation enregistrée !");
      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de l’envoi :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <label>
        Nom :
        <input {...register("nom")} type="text" required />
      </label>
      <label>
        Email :
        <input {...register("email")} type="email" required />
      </label>
      <label>
        Date :
        <input {...register("date")} type="date" required />
      </label>
      <button type="submit">Réserver</button>
    </form>
  );
};

export default Reservation;
