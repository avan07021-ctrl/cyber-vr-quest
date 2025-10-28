import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockChallenges = [
  {
    id: "1",
    title: "Взлом Веб-Сайта",
    description: "Найдите уязвимость SQL-инъекции на скомпрометированном сайте и получите доступ к базе данных.",
    difficulty: "easy" as const,
    points: 100,
    completed: true,
    locked: false,
    tags: ["SQL", "Web Security", "Injection"],
  },
  {
    id: "2",
    title: "Дешифровка Сообщения",
    description: "Перехваченное зашифрованное сообщение требует ваших навыков криптоанализа для расшифровки.",
    difficulty: "medium" as const,
    points: 250,
    completed: true,
    locked: false,
    tags: ["Cryptography", "Code Breaking"],
  },
  {
    id: "3",
    title: "Анализ Вредоносного ПО",
    description: "Исследуйте образец вредоносного ПО с использованием реверс-инжиниринга для определения его функциональности.",
    difficulty: "hard" as const,
    points: 500,
    completed: false,
    locked: false,
    tags: ["Malware", "Reverse Engineering", "Binary Analysis"],
  },
  {
    id: "4",
    title: "Сетевой Перехват",
    description: "Проанализируйте захваченный сетевой трафик для обнаружения подозрительной активности и данных эксфильтрации.",
    difficulty: "medium" as const,
    points: 300,
    completed: false,
    locked: false,
    tags: ["Network", "Packet Analysis", "Wireshark"],
  },
  {
    id: "5",
    title: "Продвинутая APT Охота",
    description: "Выследите продвинутую постоянную угрозу в корпоративной сети используя форензику и анализ логов.",
    difficulty: "expert" as const,
    points: 1000,
    completed: false,
    locked: false,
    tags: ["APT", "Threat Hunting", "Forensics", "SIEM"],
  },
  {
    id: "6",
    title: "Эксплуатация Zero-Day",
    description: "Изучите и эксплуатируйте недавно обнаруженную уязвимость нулевого дня в популярном программном обеспечении.",
    difficulty: "expert" as const,
    points: 1500,
    completed: false,
    locked: true,
    tags: ["Zero-Day", "Exploit Development", "Vulnerability Research"],
  },
];

export default function BaseChallenges() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "completed" | "available">("all");

  const filteredChallenges = mockChallenges.filter((challenge) => {
    if (filter === "completed") return challenge.completed;
    if (filter === "available") return !challenge.completed && !challenge.locked;
    return true;
  });

  const handleChallengeClick = (challengeId: string) => {
    console.log("Opening challenge:", challengeId);
    // Challenge detail page will be implemented
  };

  return (
    <div className="min-h-screen pb-8">
      <Header />
      
      <div className="container mx-auto px-4 pt-24">
        {/* Back button and header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к Базам
          </Button>
          
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  База Стажёров
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                12 заданий для начинающих агентов киберзащиты
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="glass-effect rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Прогресс базы</span>
              <span className="font-semibold">8 / 12 завершено</span>
            </div>
            <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                style={{ width: "67%" }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <Button
              variant={filter === "all" ? "cyber" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              <Filter className="w-4 h-4 mr-2" />
              Все Задания
              <Badge variant="secondary" className="ml-2 bg-secondary/30">
                {mockChallenges.length}
              </Badge>
            </Button>
            <Button
              variant={filter === "available" ? "cyber" : "outline"}
              size="sm"
              onClick={() => setFilter("available")}
            >
              Доступные
              <Badge variant="secondary" className="ml-2 bg-secondary/30">
                {mockChallenges.filter(c => !c.completed && !c.locked).length}
              </Badge>
            </Button>
            <Button
              variant={filter === "completed" ? "cyber" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Завершённые
              <Badge variant="secondary" className="ml-2 bg-accent/30">
                {mockChallenges.filter(c => c.completed).length}
              </Badge>
            </Button>
          </div>
        </div>

        {/* Challenges grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              {...challenge}
              onClick={() => handleChallengeClick(challenge.id)}
            />
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Нет заданий, соответствующих выбранному фильтру
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
