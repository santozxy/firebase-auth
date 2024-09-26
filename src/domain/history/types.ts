
export interface Activity {
  [x: string]: any;
  name: string;
  duration: number;
  status: "Pendente" | "Em andamento" | "Completa" | "Cancelada";
  timeWorked: number;
  startDate: string | null;
  endDate: string | null;
}