export interface Activity {
  [x: string]: unknown;
  name: string;
  duration: number;
  status: "Pendente" | "Em andamento" | "Completa" | "Cancelada";
  timeWorked: number;
  startDate: string | null;
  endDate: string | null;
  classification: "Estudos" | "Trabalho" | "Lazer" | "Outros";
}
