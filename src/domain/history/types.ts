export type ActivityType = "Trabalho" | "Estudo" | "Exercício" | "Outro";
export type ActivityStatus = "Concluído" | "Cancelado";

export interface Activity {
  name: string;
  type: ActivityType;
  duration: number;
  timeWorked: number;
  status: ActivityStatus;
  reason: string;
  completedAt: Date;
}
