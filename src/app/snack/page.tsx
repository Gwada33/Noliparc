"use client";

import React from "react";

type Item = {
  name: string;
  price: string;
};

type Category = {
  title: string;
  items: Item[];
};

const categories: Category[] = [
  {
    title: "Pause Salée",
    items: [
      { name: "Menu Adulte", price: "12.50€" },
      { name: "Menu Enfant", price: "8.50€" },
      { name: "Hamburger/Frites", price: "9.50€" },
      { name: "Panini Jambon-fromage", price: "7.50€" },
      { name: "Panini Fromage", price: "6.50€" },
      { name: "Panini Thon", price: "8.50€" },
      { name: "Popcorn Grand", price: "4.50€" },
      { name: "Popcorn Petit", price: "3.50€" },
    ],
  },
  {
    title: "Boissons",
    items: [
      { name: "Eau 50CL", price: "2.00€" },
      { name: "Eau 1.5L", price: "3.50€" },
      { name: "Canettes", price: "2.50€" },
      { name: "Cannette 50CL", price: "3.50€" },
      { name: "Jus MAAZA", price: "3.50€" },
      { name: "Caprisun / Banga", price: "1.50€" },
      { name: "Café", price: "2.00€" },
      { name: "Bouteille 50CL", price: "3.50€" },
    ],
  },
   {
    title: "Pause Sucrée",
    items: [
      { name: "Bonbon 0.30€", price: "" },
      { name: "Bonbon 0.50€", price: "" },
      { name: "Bonbon 0.80€", price: "" },
      { name: "Bonbon 1.30€", price: "" },
      { name: "Gaufrette S.Glace", price: "3.00€" },
      { name: "Gaufrette Nutella", price: "3.50€" },
      { name: "Crêpes Sucrée", price: "3.00€" },
      { name: "Crêpes Nutella", price: "3.50€" },
      { name: "Granita Grand", price: "3.00€" },
      { name: "Granita Petit", price: "2.00€" },
    ],
  },
];


export default function MenuTables() {
  return (
    <section className="menu-container">
      <h2 className="menu-title">Découvrez nos délicieuses offres</h2>
      <div className="menu-grid">
        {categories.map((category, index) => (
          <div key={index} className="menu-card">
            <h3 className="menu-card-title">{category.title}</h3>
            <table className="menu-table">
              <tbody>
                {category.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="item-name">{item.name}</td>
                    <td className="item-price">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
