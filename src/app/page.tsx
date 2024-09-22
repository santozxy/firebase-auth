import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, CheckCircle, BarChart, ArrowRight } from "lucide-react";

export default function PomodoroLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Timer className="h-6 w-6 mr-2" />
          <span className="font-bold">PomoPro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#recursos"
          >
            Recursos
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#como-funciona"
          >
            Como Funciona
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#precos"
          >
            Preços
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/login"
          >
            Entrar
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Aumente sua Produtividade com PomoPro
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  O aplicativo definitivo de timer Pomodoro que ajuda você a
                  focar, gerenciar seu tempo e alcançar mais.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Comece Gratuitamente</Button>
                <Button variant="outline">Saiba Mais</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="recursos"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Principais Recursos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Timer className="w-8 h-8 mb-2" />
                  <CardTitle>Timers Personalizáveis</CardTitle>
                </CardHeader>
                <CardContent>
                  Defina durações de trabalho e pausa que se adequem ao seu
                  fluxo de trabalho. Adapte a técnica Pomodoro às suas
                  necessidades.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <CardTitle>Gerenciamento de Tarefas</CardTitle>
                </CardHeader>
                <CardContent>
                  Crie e organize suas tarefas. Marque-as como concluídas à
                  medida que progride em suas sessões de trabalho.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart className="w-8 h-8 mb-2" />
                  <CardTitle>Análise de Produtividade</CardTitle>
                </CardHeader>
                <CardContent>
                  Acompanhe seu tempo de foco e tarefas concluídas. Obtenha
                  insights sobre seus padrões de produtividade.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="como-funciona" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Como Funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mb-4">
                  1
                </div>
                <h3 className="font-bold mb-2">Configure seu Timer</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Escolha sua duração de trabalho, geralmente 25 minutos.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mb-4">
                  2
                </div>
                <h3 className="font-bold mb-2">Foque na sua Tarefa</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Trabalhe na sua tarefa até o timer tocar.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mb-4">
                  3
                </div>
                <h3 className="font-bold mb-2">Faça uma Pausa Curta</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Aproveite uma pausa de 5 minutos para recarregar.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center mb-4">
                  4
                </div>
                <h3 className="font-bold mb-2">Repita</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Continue o ciclo para manter a produtividade.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="precos"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Preços Simples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Grátis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Timer Pomodoro básico
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Lista de tarefas
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Estatísticas diárias
                    </li>
                  </ul>
                  <Button className="w-full">Começar</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Todos os recursos Grátis
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Intervalos de timer personalizados
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Análises avançadas
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Exportação de dados
                    </li>
                  </ul>
                  <Button className="w-full">Atualizar para Pro</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Pronto para Aumentar sua Produtividade?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Comece a usar o PomoPro hoje e experimente o poder das sessões
                  de trabalho focadas.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Comece Gratuitamente</Button>
                <Button variant="outline">
                  Saiba Mais <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 PomoPro. Todos os direitos reservados.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Termos de Serviço
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacidade
          </Link>
        </nav>
      </footer>
    </div>
  );
}
