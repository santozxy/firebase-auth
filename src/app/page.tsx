import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { PomodoroTimer } from "@/components/timer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="pt-8 pb-6 px-4 text-center">
        <div className="flex justify-center items-center mb-4">
          <Clock className="h-12 w-12 text-primary mr-2" />
          <h1 className="text-4xl font-bold text-primary">PomoPro</h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Maximize sua produtividade com a técnica Pomodoro
        </p>
      </header>
      <Separator />
      <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-4 py-8 gap-8">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold mb-6">
            Aumente seu foco e produtividade
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            PomoPro é a ferramenta perfeita para quem busca melhorar sua gestão
            de tempo e aumentar a produtividade. Com nossa aplicação intuitiva,
            você pode facilmente implementar a técnica Pomodoro em sua rotina
            diária.
          </p>
          <div className="space-y-4 mb-6">
            {[
              "Temporizadores personalizáveis",
              "Acompanhamento de tarefas",
              "Estatísticas detalhadas",
            ].map((feature, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="h-6 w-6 text-primary mr-3" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Produtividade
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Gestão de Tempo
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Foco
            </Badge>
          </div>
          <Button size="lg" className="w-full md:w-auto">
            <Link href="/login">Começar agora</Link>
          </Button>
        </div>

        <div className="flex-shrink-0">
          <PomodoroTimer />
        </div>
      </main>

      <footer className="py-4 px-4 text-center text-sm text-muted-foreground">
        © 2024 PomoPro. Todos os direitos reservados.
      </footer>
    </div>
  );
}
