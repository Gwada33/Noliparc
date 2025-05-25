// lib/useMyReservations.ts
import { useAuth } from '@/app/context/AuthContext';
import useSWR from 'swr';


export function useMyReservations() {
  const { user } = useAuth();            // côté client, ici c’est permis
  return useSWR(
    user ? `/api/reservation/my?uid=${user.id}` : null,   // pas d’appel si pas de user
    (url) => fetch(url).then((r) => r.json()),
    { revalidateOnFocus: false },
  );
}