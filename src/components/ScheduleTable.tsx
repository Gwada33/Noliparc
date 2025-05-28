import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
} from "@mui/material";
import { FaCalendarAlt } from "react-icons/fa";

interface ScheduleTableProps {
  title: string;
  headers: string[]; // Ex: ["3-6 ans", "7-99 ans"]
  data: [string, ...string[]][]; // Ex: ["Lun.", "Fermé", "Fermé"]
}

export const ScheduleTable = ({ title, headers, data }: ScheduleTableProps) => {
  return (
    <Box mb={6}  sx={{
    width: "100%",
    maxWidth: 600,
    mx: "auto", // centre horizontalement
    px: 2, // padding horizontal pour petits écrans
  }}>
      <Box display="flex" alignItems="center" mb={1}>
        <FaCalendarAlt size={22} style={{ marginRight: 10 }} />
        <Typography variant="h4" color="#000" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      <Table>
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
                    fontWeight: 500,
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
  );
};
