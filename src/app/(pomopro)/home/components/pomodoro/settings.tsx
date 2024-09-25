import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";

interface SettingsProps {
  breakTime: number;
  onBreakTimeChange: (value: number) => void;
  disabled: boolean;
}

export function Settings({ breakTime, onBreakTimeChange, disabled }: SettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <SettingsIcon className="mr-2" />
          Configurações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Label htmlFor="breakTime">Tempo de Descanso (minutos):</Label>
          <Input
            id="breakTime"
            type="number"
            value={breakTime}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0) {
                onBreakTimeChange(value);
              }
            }}
            className="w-20"
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
}