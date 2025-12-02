"use client";

import React, { useState } from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import Calendar from "@/components/Calendar";
import { useAuth } from "@/app/context/AuthContext";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AdminCalendrierPage() {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(12);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  if (!user) {
    return (
      <Box p={4}>
        <Typography color="error">Accès restreint. Veuillez vous connecter.</Typography>
      </Box>
    );
  }

  return (
    <main className="page" style={{ padding: 24 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" color="#000000">
          Administration - Calendrier
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handlePrevMonth}>
            <FaChevronLeft />
          </IconButton>
          <Typography variant="h6" style={{ minWidth: 150, textAlign: 'center' }}>
            {new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <FaChevronRight />
          </IconButton>
        </Box>
      </Box>

      <Calendar 
        key={`${year}-${month}`} 
        year={year} 
        month={month} 
        storageKey={`calendar-${year}-${month}`} 
        editable={true} 
      />
    </main>
  );
}


