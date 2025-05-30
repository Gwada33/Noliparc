"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";

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
      { name: "Sandwich jambon-fromage", price: "4.00€" },
      { name: "Panini poulet", price: "4.50€" },
      { name: "Croque-monsieur", price: "3.50€" },
      { name: "Salade César", price: "5.50€" },
      { name: "Frites", price: "2.50€" },
    ],
  },
  {
    title: "Pause Sucrée",
    items: [
      { name: "Brownie", price: "2.50€" },
      { name: "Cookie maison", price: "2.00€" },
      { name: "Glace 2 boules", price: "3.00€" },
      { name: "Pain au chocolat", price: "1.80€" },
    ],
  },
  {
    title: "Boissons Froides",
    items: [
      { name: "Coca-Cola", price: "2.00€" },
      { name: "Fanta Orange", price: "2.00€" },
      { name: "Jus d’orange", price: "2.50€" },
      { name: "Eau minérale", price: "1.50€" },
    ],
  },
  {
    title: "Boissons Chaudes",
    items: [
      { name: "Café", price: "1.80€" },
      { name: "Thé", price: "1.80€" },
      { name: "Chocolat chaud", price: "2.20€" },
    ],
  },
];

export default function MenuTables() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 4,
        px: 2,
        py: 4,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {categories.map((category, index) => (
        <TableContainer key={index} component={Paper} sx={{ boxShadow: 3 }}>
          <Typography
            variant="h6"
            sx={{ p: 2, backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" }}
          >
            {category.title}
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Produit</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Prix</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {category.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ))}
    </Box>
  );
}
