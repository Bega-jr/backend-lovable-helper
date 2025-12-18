import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiService, PalpitesResponse } from "@/services/api";
import { AppLayout } from "@/components/AppLayout";
import { LotteryBall } from "@/components/LotteryBall";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Copy, Clock, Star, RefreshCw } from "lucide-react";

export default function Palpites() {
  const { toast } = useToast();
  const [palpitesData, setPalpitesData] = useState<PalpitesResponse | null>(null);

  const { mutate: gerarPalpites, isPending } = useMutation({
    mutationFn: () => apiService.getPalpites(),
    onSuccess: (data) => {
      setPalpitesData(data);
      toast({
        title: "Palpites Gerados!",
        description: `7 novos palpites baseados em ${data.baseado_em.total_sorteios} sorteios.`,
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível gerar os palpites. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (numbers: number[]) => {
    const text = numbers.map((n) => n.toString().padStart(2, "0")).join(", ");
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Números copiados para a área de transferência.",
    });
  };

  const isFixedNumber = (num: number) => {
    return palpitesData?.numeros_fixos?.includes(num) || false;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gerador de Palpites</h1>
            <p className="text-muted-foreground">
              Gere apostas inteligentes baseadas em estatísticas
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => gerarPalpites()}
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            Gerar Novos Palpites
          </Button>
        </div>

        {/* Fixed Numbers Info */}
        {palpitesData?.numeros_fixos && palpitesData.numeros_fixos.length > 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Números Fixos (Mais Quentes)
              </CardTitle>
              <CardDescription>
                Estes números aparecem em 5 das 7 apostas por serem os mais sorteados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {palpitesData.numeros_fixos.map((num) => (
                  <LotteryBall key={num} number={num} variant="hot" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generation Time */}
        {palpitesData?.data_geracao && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Gerado em: {new Date(palpitesData.data_geracao).toLocaleString("pt-BR")}
            </span>
            <span className="mx-2">•</span>
            <span>
              Baseado em {palpitesData.baseado_em.total_sorteios} sorteios até o concurso{" "}
              {palpitesData.baseado_em.ultimo_concurso}
            </span>
          </div>
        )}

        {/* Bets Grid */}
        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 15 }).map((_, j) => (
                      <Skeleton key={j} className="w-10 h-10 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : palpitesData?.palpites ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {palpitesData.palpites.map((aposta, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Aposta {index + 1}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(aposta)}
                    title="Copiar números"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {aposta
                      .sort((a, b) => a - b)
                      .map((num) => (
                        <LotteryBall
                          key={num}
                          number={num}
                          variant={isFixedNumber(num) ? "hot" : "primary"}
                          size="sm"
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Pronto para gerar palpites?
                </h3>
                <p className="text-muted-foreground mt-1">
                  Clique no botão acima para gerar 7 apostas inteligentes
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
