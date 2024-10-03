"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, X } from "lucide-react";
import { Activity } from "@/domain/history/types";
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
import { Button } from "@/components/ui/button";
import { CardActivity } from "@/app/(pomopro)/components/card-activity/card-activity";
import { deleteAcitivity } from "@/domain/activities/activities";
import { revalidateRequest } from "@/app/actions/revalidate-tag";
import { useAuth } from "@/hooks/use-auth";
import { usePomodoroContext } from "@/context/pomodoro-context";

export interface ActivityWithId extends Activity {
  id: string;
}

interface ActivityHistoryProps {
  activities: ActivityWithId[];
}

export function ActivityHistory({ activities }: ActivityHistoryProps) {
  const { uuid } = useAuth();
  const { removeActivity } = usePomodoroContext();
  const [filteredActivities, setFilteredActivities] =
    useState<ActivityWithId[]>(activities);
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");

  const onDelete = async (activityID: string) => {
    await revalidateRequest("getHistoryActivity");
    if (!uuid) return;
    await deleteAcitivity(uuid, activityID);
    removeActivity(activityID);
  };

  const applyFilters = useCallback(() => {
    let result = activities;

    if (searchTerm) {
      result = result.filter((activity) =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((activity) => activity.status === statusFilter);
    }

    if (classificationFilter !== "all") {
      result = result.filter(
        (activity) => activity.classification === classificationFilter
      );
    }

    setFilteredActivities(result);
  }, [activities, searchTerm, statusFilter, classificationFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setClassificationFilter("all");
  };

  const isFiltersApplied =
    statusFilter !== "all" || classificationFilter !== "all";

  const classifications = ["Estudos", "Trabalho", "Lazer", "Outro"];

  return (
    <Card className="">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="search-activities"
              className="w-full"
            />
          </div>

          <div className="w-full sm:w-1/3">
            <Label htmlFor="status-filter" className="mb-2 block">
              Status
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Completa">Completa</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-1/3">
            <Label htmlFor="classification-filter" className="mb-2 block">
              Classificação
            </Label>
            <Select
              value={classificationFilter}
              onValueChange={setClassificationFilter}
            >
              <SelectTrigger id="classification-filter">
                <SelectValue placeholder="Selecione a classificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {classifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isFiltersApplied && (
            <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:self-end">
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <X className="mr-2 h-4 w-4 text-destructive" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-18rem)] pr-4">
          {filteredActivities.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma atividade encontrada.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredActivities.map((activity) => (
                <CardActivity
                  key={activity.id}
                  activity={activity}
                  onDelete={() => onDelete(activity.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
