import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Alert
} from "@mui/material";
import { FaCalendarAlt, FaTimesCircle } from "react-icons/fa";

interface ScheduleTableProps {
  title: string;
  headers: string[]; // Ex: ["3-6 ans", "7-99 ans"]
  data: [string, ...string[]][]; // Ex: ["Lun.", "Fermé", "Fermé"]
  parkStatus?: 'open' | 'closed' | 'maintenance';
}

export const ScheduleTable = ({ title, headers, data, parkStatus = 'open' }: ScheduleTableProps) => {
  // Mapping for display title
  const getDisplayTitle = (t: string) => {
    const map: Record<string, string> = {
      'regular': 'Périodes Scolaires',
      'vacation': 'Pendant les vacances',
      'school': 'Périodes Scolaires', // Fallback
      'holidays': 'Pendant les vacances' // Fallback
    };
    return map[t.toLowerCase()] || t;
  };

  return (
    <Box mb={6} sx={{
      width: "100%",
      maxWidth: 600,
      mx: "auto", // centre horizontalement
      px: 2, // padding horizontal pour petits écrans
      position: 'relative'
    }}>
      <Box display="flex" alignItems="center" mb={1}>
        <FaCalendarAlt size={22} style={{ marginRight: 10 }} />
        <Typography variant="h4" color="#000" fontWeight="bold">
          {getDisplayTitle(title)}
        </Typography>
      </Box>

      {parkStatus === 'closed' && (
        <Alert 
          severity="error" 
          icon={<FaTimesCircle fontSize="inherit" />}
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Le parc est exceptionnellement fermé.
        </Alert>
      )}

      <Box sx={{ opacity: parkStatus === 'closed' ? 0.5 : 1, pointerEvents: parkStatus === 'closed' ? 'none' : 'auto' }}>
        <Table sx={{
              fontWeight: "600",
              fontFamily: "Rubik, sans-serif"
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Jour</TableCell>
              {headers.map((age, i) => (
                <TableCell key={i}>{age}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(([jour, ...horaires]) => (
              <TableRow key={jour}>
                <TableCell sx={{ fontSize: 18, fontWeight: 600 }}>{jour}</TableCell>

                {horaires.map((h, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      color: h.toLowerCase() === "fermé" ? "#d32f2f" : "orange",
                      fontSize: 18,
                      fontFamily: 'Rubik',
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};
