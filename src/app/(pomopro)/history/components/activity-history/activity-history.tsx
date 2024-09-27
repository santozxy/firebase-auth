"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, Filter, X } from "lucide-react";
import { Activity } from "@/domain/history/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase/config";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

import { Loading } from "./loading";
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
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CardActivity } from "@/app/(pomopro)/components/card-activity/card-activity";

export interface ActivityWithId extends Activity {
  id: string;
}

export function ActivityHistory() {
  const [activities, setActivities] = useState<ActivityWithId[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<
    ActivityWithId[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { uuid, activitiesCollection } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [dateSort, setDateSort] = useState("desc");

  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  useEffect(() => {
    if (!activitiesCollection) return;
    setIsLoading(true);
    const q = query(
      activitiesCollection,
      orderBy("startDate", "desc"),
      where("status", "!=", "Pendente")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedActivities: ActivityWithId[] = [];
      querySnapshot.forEach((doc) => {
        fetchedActivities.push({ id: doc.id, ...doc.data() } as ActivityWithId);
      });
      setActivities(fetchedActivities);
      setFilteredActivities(fetchedActivities);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [uuid, activitiesCollection]);

  const handleDelete = useCallback(
    async (activity: ActivityWithId) => {
      if (!uuid || !activity.id) return;
      try {
        await deleteDoc(doc(db, "users", uuid, "activities", activity.id));
        toast({
          itemID: "activity-delete-success",
          title: "Sucesso",
          description: "Atividade excluída com sucesso.",
        });
      } catch (error) {
        toast({
          itemID: "activity-delete-error",
          title: "Erro",
          description:
            "Falha ao excluir atividade. Por favor, tente novamente.",
          variant: "destructive",
        });
        console.error("Error deleting activity:", error);
      }
    },
    [uuid]
  );

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

    if (showCompletedOnly) {
      result = result.filter((activity) => activity.status === "Completa");
    }

    result.sort((a, b) => {
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateSort === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredActivities(result);
  }, [
    activities,
    searchTerm,
    statusFilter,
    classificationFilter,
    dateSort,
    showCompletedOnly,
  ]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setClassificationFilter("all");
    setDateSort("desc");

    setShowCompletedOnly(false);
  };

  const classifications = ["Estudo", "Trabalho", "Lazer", "Outro"];
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
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="w-full sm:w-1/2">
            <Label htmlFor="search-activities" className="sr-only">
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

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="sm:w-96">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filtros</h4>
                    <p className="text-sm text-muted-foreground">
                      Ajuste os filtros para refinar sua busca
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger
                          id="status-filter"
                          className="col-span-2"
                        >
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Completa">Completa</SelectItem>
                          <SelectItem value="Em andamento">
                            Em andamento
                          </SelectItem>
                          <SelectItem value="Cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="classification-filter">
                        Classificação
                      </Label>
                      <Select
                        value={classificationFilter}
                        onValueChange={setClassificationFilter}
                      >
                        <SelectTrigger
                          id="classification-filter"
                          className="col-span-2"
                        >
                          <SelectValue placeholder="Selecione a classificação" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {classifications.map((classification) => (
                            <SelectItem
                              key={classification}
                              value={classification}
                            >
                              {classification}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="date-sort">Ordenar por data</Label>
                      <Select value={dateSort} onValueChange={setDateSort}>
                        <SelectTrigger id="date-sort" className="col-span-2">
                          <SelectValue placeholder="Ordenar por data" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">
                            Mais recentes primeiro
                          </SelectItem>
                          <SelectItem value="asc">
                            Mais antigas primeiro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="completed-only"
                        checked={showCompletedOnly}
                        onCheckedChange={setShowCompletedOnly}
                      />
                      <Label htmlFor="completed-only">
                        Mostrar apenas completas
                      </Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              onClick={resetFilters}
              variant="outline"
              className=" w-full"
            >
              <X className="mr-2 h-4 w-4 text-destructive" />
              Limpar Filtros
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-18rem)] pr-4">
          {isLoading ? (
            <Loading />
          ) : filteredActivities.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma atividade encontrada.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredActivities.map((activity) => (
                <CardActivity
                  key={activity.id}
                  activity={activity}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
