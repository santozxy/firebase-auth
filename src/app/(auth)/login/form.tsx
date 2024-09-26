"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { LogIn, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  signInEmailAndPassword,
  signInWithGoogle,
} from "@/app/lib/firebase/auth";

import google from "../../../../public/google.png";
import Image from "next/image";

export function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInEmailAndPassword(email, password);
      if (userCredential) {
        return router.push("/home");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao fazer login. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await signInWithGoogle();
      if (response) router.push("/home");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description:
          "Falha ao fazer login com Google. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Timer className="h-6 w-6 mr-2" aria-hidden="true" />
            <CardTitle className="text-2xl font-bold text-center">
              PomoPro
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Entre na sua conta para continuar
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="*******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Lembrar-me
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <div className="flex flex-col gap-5 mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={loginWithGoogle}
              disabled={loading}
            >
              <Image
                src={google}
                alt="Google"
                className="h-5 w-5 mr-3"
                width={30}
                height={30}
              />
              {loading ? "Conectando..." : "Entrar com Google"}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <div className="text-sm text-center">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Registre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
