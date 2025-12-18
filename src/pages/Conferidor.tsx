import { useState, useMemo } from "react";
import { useResultados } from "@/hooks/useResultados";
import { AppLayout } from "@/components/AppLayout";
import { LotteryBall } from "@/components/LotteryBall";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Trophy, Target } from "lucide-react";

export default function Conferidor() {
  const { toast } = useToast();
  const { data, isLoading } = useResultados();
  const [selectedConcurso, setSelectedConcurso] = useState<string>("");
  const [userNumbers, setUserNumbers] = useState<string>("");
  const [result, setResult] = useState<{
    hits: number[];
    misses: number[];
    total: number;
  } | null>(null);

  const selectedDraw = useMemo(() => {
    if (!selectedConcurso || !data?.historico) return null;
    return data.historico.find(
      (item) => item.concurso.toString() === selectedConcurso
    );
  }, [selectedConcurso, data?.historico]);

  const handleCheck = () => {
    if (!selectedDraw) {
      toast({
        title: "Selecione um concurso",
        description: "Escolha o concurso que deseja conferir.",
        variant: "destructive",
      });
      return;
    }

    const numbersInput = userNumbers
      .split(/[,\s]+/)
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 25);

    if (numbersInput.length !== 15) {
      toast({
        title: "Números inválidos",
        description: "Digite exatamente 15 números entre 1 e 25.",
        variant: "destructive",
      });
      return;
    }

    const drawnNumbers = new Set(selectedDraw.dezenas);
    const hits = numbersInput.filter((n) => drawnNumbers.has(n));
    const misses = numbersInput.filter((n) => !drawnNumbers.has(n));

    setResult({
      hits,
      misses,
      total: hits.length,
    });
  };

  const getPrizeMessage = (hits: number) => {
    if (hits >= 15) return { text: "🏆 PRÊMIO PRINCIPAL!", color: "text-accent" };
    if (hits >= 14) return { text: "💰 14 acertos - Prêmio!", color: "text-accent" };
    if (hits >= 13) return { text: "💵 13 acertos - Prêmio!", color: "text-accent" };
    if (hits >= 12) return { text: "🎫 12 acertos - Prêmio!", color: "text-accent" };
    if (hits >= 11) return { text: "🎟️ 11 acertos - Prêmio!", color: "text-accent" };
    return { text: "Sem premiação", color: "text-muted-foreground" };
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conferidor de Apostas</h1>
          <p className="text-muted-foreground">
            Confira seus números com os resultados oficiais
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Conferir Aposta
              </CardTitle>
              <CardDescription>
                Selecione o concurso e digite seus 15 números
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="concurso">Concurso</Label>
                <Select
                  value={selectedConcurso}
                  onValueChange={setSelectedConcurso}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o concurso" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.historico?.slice(0, 50).map((item) => (
                      <SelectItem key={item.concurso} value={item.concurso.toString()}>
                        Concurso {item.concurso} - {item.data}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numbers">Seus Números (15 números)</Label>
                <Input
                  id="numbers"
                  placeholder="Ex: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15"
                  value={userNumbers}
                  onChange={(e) => setUserNumbers(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Digite 15 números entre 1 e 25, separados por vírgula ou espaço
                </p>
              </div>

              <Button onClick={handleCheck} className="w-full" disabled={isLoading}>
                Conferir Aposta
              </Button>

              {/* Selected Draw Numbers */}
              {selectedDraw && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Números sorteados no concurso {selectedDraw.concurso}:
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {selectedDraw.dezenas
                      .sort((a, b) => a - b)
                      .map((num) => (
                        <LotteryBall key={num} number={num} variant="primary" size="sm" />
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Result */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-6xl font-bold text-primary">
                      {result.total}
                    </p>
                    <p className="text-muted-foreground">acertos de 15</p>
                    <p className={`mt-2 font-semibold ${getPrizeMessage(result.total).color}`}>
                      {getPrizeMessage(result.total).text}
                    </p>
                  </div>

                  {/* Hits */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-accent" />
                      <span className="font-medium">Acertos ({result.hits.length})</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {result.hits
                        .sort((a, b) => a - b)
                        .map((num) => (
                          <LotteryBall key={num} number={num} variant="hit" size="sm" />
                        ))}
                    </div>
                  </div>

                  {/* Misses */}
                  {result.misses.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <XCircle className="w-5 h-5 text-destructive" />
                        <span className="font-medium">Erros ({result.misses.length})</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {result.misses
                          .sort((a, b) => a - b)
                          .map((num) => (
                            <LotteryBall key={num} number={num} variant="miss" size="sm" />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Target className="w-8 h-8" />
                  </div>
                  <p>Preencha os campos e clique em "Conferir Aposta"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
