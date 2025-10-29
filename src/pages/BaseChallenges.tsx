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
    title: "Шифрование Caesar",
    description: "Расшифруйте перехваченное сообщение, используя классический шифр Цезаря.",
    difficulty: "easy" as const,
    points: 80,
    completed: true,
    locked: false,
    tags: ["Cryptography", "Caesar Cipher"],
  },
  {
    id: "3",
    title: "Анализ Сетевого Трафика",
    description: "Проанализируйте захваченный сетевой трафик и найдите скрытые данные в пакетах.",
    difficulty: "medium" as const,
    points: 150,
    completed: false,
    locked: false,
    tags: ["Network", "Forensics", "Base64"],
  },
  {
    id: "4",
    title: "XSS Уязвимость",
    description: "Найдите и эксплуатируйте Cross-Site Scripting уязвимость в веб-приложении.",
    difficulty: "medium" as const,
    points: 180,
    completed: false,
    locked: false,
    tags: ["Web Security", "XSS", "JavaScript"],
  },
  {
    id: "5",
    title: "Реверс-Инжиниринг",
    description: "Проанализируйте бинарный файл и найдите скрытый ключ активации.",
    difficulty: "hard" as const,
    points: 250,
    completed: false,
    locked: false,
    tags: ["Reverse Engineering", "Binary", "Hex"],
  },
  {
    id: "6",
    title: "Брутфорс SSH",
    description: "Взломайте SSH сервер используя словарь паролей и технику брутфорса.",
    difficulty: "easy" as const,
    points: 120,
    completed: false,
    locked: false,
    tags: ["Brute Force", "SSH", "Passwords"],
  },
  {
    id: "7",
    title: "Анализ Логов",
    description: "Изучите системные логи и найдите признаки несанкционированного доступа.",
    difficulty: "medium" as const,
    points: 140,
    completed: false,
    locked: false,
    tags: ["Forensics", "Logs", "Detection"],
  },
  {
    id: "8",
    title: "OSINT Расследование",
    description: "Используйте открытые источники для сбора информации о цели.",
    difficulty: "medium" as const,
    points: 160,
    completed: false,
    locked: false,
    tags: ["OSINT", "Reconnaissance", "Social Engineering"],
  },
  {
    id: "9",
    title: "Privilege Escalation",
    description: "Повысьте привилегии в скомпрометированной системе Linux до root.",
    difficulty: "hard" as const,
    points: 280,
    completed: false,
    locked: true,
    tags: ["Linux", "Privilege Escalation", "Exploit"],
  },
  {
    id: "10",
    title: "WiFi Взлом",
    description: "Взломайте защищенную WiFi сеть используя WPA2 атаку.",
    difficulty: "hard" as const,
    points: 300,
    completed: false,
    locked: true,
    tags: ["Wireless", "WPA2", "Cracking"],
  },
  {
    id: "11",
    title: "API Эксплойт",
    description: "Найдите и эксплуатируйте уязвимость в REST API endpoint.",
    difficulty: "medium" as const,
    points: 170,
    completed: false,
    locked: true,
    tags: ["API", "Web Security", "Injection"],
  },
  {
    id: "12",
    title: "Финальное Испытание",
    description: "Комбинированное задание на все навыки кибербезопасности.",
    difficulty: "hard" as const,
    points: 500,
    completed: false,
    locked: true,
    tags: ["Final Boss", "All Skills", "Challenge"],
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
    window.location.href = `/challenge/${challengeId}`;
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
