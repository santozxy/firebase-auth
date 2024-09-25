
export interface Activity {
  name: string;
  duration: number;
  status: "Pendente" | "Em andamento" | "Completa" | "Cancelada";
  timeWorked: number;
  startDate: string | null;
  endDate: string | null;
}