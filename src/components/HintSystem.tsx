import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Lock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Hint {
  id: string;
  text: string;
  cost: number;
}

interface HintSystemProps {
  hints: Hint[];
  availablePoints: number;
  onHintUnlock: (hintId: string, cost: number) => void;
}

export const HintSystem = ({ hints, availablePoints, onHintUnlock }: HintSystemProps) => {
  const [unlockedHints, setUnlockedHints] = useState<Set<string>>(new Set());

  const handleUnlock = (hint: Hint) => {
    if (availablePoints >= hint.cost && !unlockedHints.has(hint.id)) {
      setUnlockedHints((prev) => new Set([...prev, hint.id]));
      onHintUnlock(hint.id, hint.cost);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          Подсказки
        </h3>
        <Badge variant="outline" className="border-primary/50">
          {availablePoints} очков доступно
        </Badge>
      </div>

      <div className="space-y-3">
        {hints.map((hint, index) => {
          const isUnlocked = unlockedHints.has(hint.id);
          const canAfford = availablePoints >= hint.cost;

          return (
            <Card
              key={hint.id}
              className={cn(
                "p-4 transition-all duration-300",
                isUnlocked ? "glass-effect border-accent/50" : "glass-effect opacity-80"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Подсказка {index + 1}
                    </span>
                    {isUnlocked && <Eye className="w-4 h-4 text-accent" />}
                  </div>

                  {isUnlocked ? (
                    <p className="text-sm leading-relaxed animate-fade-in">{hint.text}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Разблокируйте подсказку, чтобы увидеть содержимое
                    </p>
                  )}
                </div>

                {!isUnlocked && (
                  <Button
                    variant={canAfford ? "cyber" : "outline"}
                    size="sm"
                    onClick={() => handleUnlock(hint)}
                    disabled={!canAfford}
                    className="shrink-0"
                  >
                    {canAfford ? (
                      <>
                        <Lightbulb className="w-4 h-4 mr-1" />
                        {hint.cost} очков
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        {hint.cost} очков
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
