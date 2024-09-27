import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Activity } from "@/domain/history/types";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityFormProps {
  onAddActivity: (activity: Activity) => void;
}

export function ActivityForm({ onAddActivity }: ActivityFormProps) {
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityDuration, setNewActivityDuration] = useState("");
  const [newActivityClassification, setNewActivityClassification] =
    useState<Activity["classification"]>("Estudos");

  const addActivity = () => {
    if (!newActivityName.trim() || newActivityName.length < 5) {
      toast({
        title: "Nome da atividade inválido",
        variant: "destructive",
        description: "O nome da atividade deve ter pelo menos 5 caracteres.",
      });
      return;
    }
    const duration = parseInt(newActivityDuration);
    if (isNaN(duration) || duration <= 0) {
      toast({
        title: "Preencha a duração da atividade",
        variant: "destructive",
        description: "A duração da atividade deve ser um número positivo.",
      });
      return;
    }
    const newActivity: Activity = {
      name: newActivityName,
      duration: duration * 60,
      status: "Pendente",
      timeWorked: 0,
      startDate: null,
      endDate: null,
      classification: newActivityClassification,
    };
    onAddActivity(newActivity);
    setNewActivityName("");
    setNewActivityDuration("");
    setNewActivityClassification("Estudos");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlusCircle className="mr-2" />
          Adicionar Atividade
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="classification">Classificação</Label>
            <Select
              value={newActivityClassification}
              onValueChange={(value) =>
                setNewActivityClassification(
                  value as Activity["classification"]
                )
              }
            >
              <SelectTrigger id="classification">
                <SelectValue placeholder="Selecione uma classificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Estudos">Estudos</SelectItem>
                <SelectItem value="Trabalho">Trabalho</SelectItem>
                <SelectItem value="Lazer">Lazer</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Nome da Atividade</Label>
            <Input
              id="name"
              placeholder="Ex: Estudar matemática"
              value={newActivityName}
              required
              onChange={(e) => setNewActivityName(e.target.value)}
              minLength={5}
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input
              placeholder="Ex: 25"
              id="duration"
              type="number"
              value={newActivityDuration}
              onChange={(e) => setNewActivityDuration(e.target.value)}
            />
          </div>
          <Button onClick={addActivity}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
