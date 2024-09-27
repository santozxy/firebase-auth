import { CheckCircle, XCircle, Clock } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completa":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Cancelada":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "Em andamento":
      return <Clock className="h-4 w-4 text-blue-500" />;
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
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-orange-100 text-orange-800";
  }
};
