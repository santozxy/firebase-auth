import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { Activity } from "@/domain/history/types";
import { toast } from "@/hooks/use-toast";

interface ActivityFormProps {
  onAddActivity: (activity: Activity) => void;
  disabled: boolean;
}

export function ActivityForm({ onAddActivity, disabled }: ActivityFormProps) {
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityDuration, setNewActivityDuration] = useState("");

  const addActivity = () => {
    if (disabled) return;
    if (!newActivityName.trim()) {
      toast({
        title: "Preencha o nome da atividade",
        variant: "destructive",
        description: "O nome da atividade não pode ser vazio.",
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
      duration: duration * 60, // convert to seconds
      status: "Pendente",
      timeWorked: 0,
      startDate: null,
      endDate: null,
    };
    onAddActivity(newActivity);
    setNewActivityName("");
    setNewActivityDuration("");
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
            <Label htmlFor="name">Nome da Atividade</Label>
            <Input
              id="name"
              placeholder="Ex: Estudar React"
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>
          <Button onClick={addActivity} disabled={disabled}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
