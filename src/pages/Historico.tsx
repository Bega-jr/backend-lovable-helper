import { useState, useMemo } from "react";
import { useResultados } from "@/hooks/useResultados";
import { AppLayout } from "@/components/AppLayout";
import { LotteryBall } from "@/components/LotteryBall";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar } from "lucide-react";

export default function Historico() {
  const { data, isLoading, error } = useResultados();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDraw, setSelectedDraw] = useState<{
    concurso: number;
    data: string;
    dezenas: number[];
  } | null>(null);

  const filteredHistory = useMemo(() => {
    if (!data?.historico) return [];
    
    if (!searchTerm) return data.historico;
    
    return data.historico.filter(
      (item) =>
        item.concurso.toString().includes(searchTerm) ||
        item.data.includes(searchTerm)
    );
  }, [data?.historico, searchTerm]);

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="p-6">
            <p className="text-destructive">Erro ao carregar histórico. Tente novamente.</p>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico de Resultados</h1>
          <p className="text-muted-foreground">
            Consulte todos os sorteios anteriores da Lotofácil
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número do concurso ou data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sorteios</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Concurso</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="hidden md:table-cell">Dezenas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHistory.map((item) => (
                        <TableRow
                          key={item.concurso}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedDraw(item)}
                        >
                          <TableCell className="font-medium">
                            {item.concurso}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {item.data}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex gap-1 flex-wrap">
                              {item.dezenas
                                .sort((a, b) => a - b)
                                .slice(0, 5)
                                .map((num) => (
                                  <span
                                    key={num}
                                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                                  >
                                    {num.toString().padStart(2, "0")}
                                  </span>
                                ))}
                              <span className="text-xs text-muted-foreground">
                                +{item.dezenas.length - 5} mais
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {filteredHistory.length === 0 && !isLoading && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum resultado encontrado para "{searchTerm}"
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Draw Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Sorteio</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDraw ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Concurso</p>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedDraw.concurso}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="text-lg font-medium text-foreground">
                      {selectedDraw.data}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Números Sorteados
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedDraw.dezenas
                        .sort((a, b) => a - b)
                        .map((num) => (
                          <LotteryBall key={num} number={num} variant="primary" size="sm" />
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Selecione um sorteio na tabela para ver os detalhes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
