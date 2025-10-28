import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseCardProps {
  title: string;
  description: string;
  challengeCount: number;
  completedCount: number;
  locked: boolean;
  color: "cyan" | "purple" | "green" | "pink";
  onClick: () => void;
}

const colorClasses = {
  cyan: "from-primary/30 to-primary/10 border-primary/50 hover:border-primary",
  purple: "from-secondary/30 to-secondary/10 border-secondary/50 hover:border-secondary",
  green: "from-accent/30 to-accent/10 border-accent/50 hover:border-accent",
  pink: "from-[hsl(320,100%,60%)]/30 to-[hsl(320,100%,60%)]/10 border-[hsl(320,100%,60%)]/50 hover:border-[hsl(320,100%,60%)]",
};

export const BaseCard = ({ 
  title, 
  description, 
  challengeCount, 
  completedCount, 
  locked, 
  color,
  onClick 
}: BaseCardProps) => {
  const progress = (completedCount / challengeCount) * 100;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 group",
        "bg-gradient-to-br backdrop-blur-md border-2 p-6",
        colorClasses[color],
        locked && "opacity-60 cursor-not-allowed"
      )}
      onClick={!locked ? onClick : undefined}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-current/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              {title}
              {locked ? (
                <Lock className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Unlock className="w-5 h-5 text-primary" />
              )}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-semibold">
              {completedCount}/{challengeCount} заданий
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex gap-2 flex-wrap pt-2">
            <Badge variant="outline" className="border-primary/50 text-primary">
              {challengeCount} заданий
            </Badge>
            {!locked && completedCount > 0 && (
              <Badge variant="secondary" className="bg-secondary/20">
                {progress.toFixed(0)}% завершено
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-current/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-current/10 to-transparent rounded-tr-full" />
    </Card>
  );
};
