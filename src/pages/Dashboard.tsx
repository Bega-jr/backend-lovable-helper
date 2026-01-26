import { useResultados } from "@/hooks/useResultados";
import { LotteryBall } from "@/components/LotteryBall";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown, Calendar, Hash, RefreshCw, AlertCircle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export default function Dashboard() {
  const { data, isLoading, error, refetch, isFetching } = useResultados();

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Card className="p-8 max-w-md text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Erro ao carregar dados</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente.
                </p>
              </div>
              <Button 
                onClick={() => refetch()} 
                disabled={isFetching}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                Tentar Novamente
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const hotNumbers = data?.numeros_quentes?.slice(0, 10) || [];
  const coldNumbers = data?.numeros_frios?.slice(0, 10) || [];

  const hotChartData = hotNumbers.map((num) => ({
    number: num.toString().padStart(2, "0"),
    frequency: data?.frequencia_numeros?.[num.toString()] || 0,
  }));

  const coldChartData = coldNumbers.map((num) => ({
    number: num.toString().padStart(2, "0"),
    frequency: data?.frequencia_numeros?.[num.toString()] || 0,
  }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral dos resultados da Lotofácil</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Último Concurso
              </CardTitle>
              <Hash className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {data?.ultimo_concurso?.concurso}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Data do Sorteio
              </CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {data?.ultimo_concurso?.data}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Sorteios
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {data?.total_sorteios?.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Last Draw */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Números Sorteados</span>
              {data?.ultimo_concurso && (
                <span className="text-sm font-normal text-muted-foreground">
                  Concurso {data.ultimo_concurso.concurso}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {data?.ultimo_concurso?.dezenas
                  ?.sort((a, b) => a - b)
                  .map((num) => (
                    <LotteryBall key={num} number={num} variant="primary" />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hot Numbers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-lottery-hot" />
                10 Números Mais Quentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {hotNumbers.map((num) => (
                      <LotteryBall key={num} number={num} variant="hot" size="sm" />
                    ))}
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hotChartData}>
                        <XAxis dataKey="number" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            background: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                          {hotChartData.map((_, index) => (
                            <Cell key={index} fill="hsl(0, 84%, 60%)" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cold Numbers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-lottery-cold" />
                10 Números Mais Frios
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {coldNumbers.map((num) => (
                      <LotteryBall key={num} number={num} variant="cold" size="sm" />
                    ))}
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={coldChartData}>
                        <XAxis dataKey="number" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            background: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                          {coldChartData.map((_, index) => (
                            <Cell key={index} fill="hsl(217, 91%, 60%)" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
