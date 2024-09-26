import { CheckCircle, XCircle, Clock } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completa":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Cancelada":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Completa":
      return "bg-green-100 text-green-800";
    case "Cancelada":
      return "bg-red-100 text-red-800";
    case "Em andamento":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const timeInMinutes = (time: number) => Math.floor(time / 60);

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};


export const formatDate = (date: string) => {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}