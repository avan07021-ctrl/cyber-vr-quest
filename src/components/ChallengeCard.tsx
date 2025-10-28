import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  points: number;
  completed: boolean;
  locked: boolean;
  tags: string[];
  onClick: () => void;
}

const difficultyConfig = {
  easy: { label: "Легко", color: "text-green-400 border-green-400/50" },
  medium: { label: "Средне", color: "text-yellow-400 border-yellow-400/50" },
  hard: { label: "Сложно", color: "text-orange-400 border-orange-400/50" },
  expert: { label: "Эксперт", color: "text-red-400 border-red-400/50" },
};

export const ChallengeCard = ({
  title,
  description,
  difficulty,
  points,
  completed,
  locked,
  tags,
  onClick,
}: ChallengeCardProps) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer",
        "glass-effect p-5",
        locked && "opacity-50 cursor-not-allowed",
        completed && "border-accent/50"
      )}
      onClick={!locked ? onClick : undefined}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        {completed ? (
          <CheckCircle2 className="w-6 h-6 text-accent animate-pulse" />
        ) : locked ? (
          <Circle className="w-6 h-6 text-muted-foreground" />
        ) : (
          <Circle className="w-6 h-6 text-primary" />
        )}
      </div>

      <div className="pr-10">
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge variant="outline" className={difficultyConfig[difficulty].color}>
            {difficultyConfig[difficulty].label}
          </Badge>
          <Badge variant="outline" className="border-primary/50">
            <Star className="w-3 h-3 mr-1 inline" />
            {points} очков
          </Badge>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-secondary/20">
              {tag}
            </Badge>
          ))}
        </div>

        <Button
          variant="cyber"
          size="sm"
          className="w-full"
          disabled={locked}
        >
          {completed ? "Пройти снова" : locked ? "Заблокировано" : "Начать задание"}
        </Button>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
};
