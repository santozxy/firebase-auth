import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <HistoryIcon className="mr-2" aria-hidden="true" />
            Histórico de Atividades
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
          <div className="w-full sm:w-1/3">
            <Label htmlFor="search-activities" className="mb-2 block">
              Pesquisa
            </Label>
            <Input
              type="text"
              placeholder="Buscar atividades..."
              id="search-activities"
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <Label htmlFor="status-filter" className="mb-2 block">
              Status
            </Label>
            <Select value="all">
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/3">
            <Label htmlFor="classification-filter" className="mb-2 block">
              Classificação
            </Label>
            <Select value="all">
              <SelectTrigger id="classification-filter">
                <SelectValue placeholder="Selecione a classificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-18rem)] pr-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 15 }).map((_, index) => (
              <Skeleton key={index} className="h-52 rounded-lg w-full" />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
