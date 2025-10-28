import { useState } from "react";
import { BaseCard } from "@/components/BaseCard";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import heroImage from "@/assets/hero-cyber.jpg";

const bases = [
  {
    id: "intern",
    title: "База Стажёров",
    description: "Начните свой путь в Агентстве Киберзащиты с 12 бесплатными заданиями для новичков.",
    challengeCount: 12,
    completedCount: 8,
    locked: false,
    color: "cyan" as const,
  },
  {
    id: "headquarters",
    title: "Главная База",
    description: "Охотьтесь на киберпреступников по всему миру, используя взлом кодов, криминалистику и реверс-инжиниринг.",
    challengeCount: 100,
    completedCount: 23,
    locked: false,
    color: "purple" as const,
  },
  {
    id: "moon",
    title: "Лунная База",
    description: "Программируйте на Python, исследуйте инопланетные сигналы и защищайте Луну от галактических угроз.",
    challengeCount: 50,
    completedCount: 0,
    locked: true,
    color: "green" as const,
  },
  {
    id: "forensics",
    title: "База Криминалистики",
    description: "Исследуйте места преступлений, анализируйте улики и раскрывайте интригующие дела.",
    challengeCount: 38,
    completedCount: 0,
    locked: true,
    color: "pink" as const,
  },
];

export default function Dashboard() {
  const [selectedBase, setSelectedBase] = useState<string | null>(null);

  const handleBaseClick = (baseId: string) => {
    setSelectedBase(baseId);
    window.location.href = `/base/${baseId}`;
  };

  return (
    <div className="min-h-screen pb-8">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Cyber command center" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <Badge variant="outline" className="border-primary/50 px-4 py-2 text-sm animate-pulse-glow">
              <Zap className="w-4 h-4 mr-2 inline" />
              200+ Заданий Доступно
            </Badge>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Станьте Киберагентом
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Отправьтесь в приключение по борьбе с киберпреступностью через 200+ заданий в четырёх уникальных базах
          </p>
          
          <Button variant="cyber" size="xl" className="group">
            Начать Миссию
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </section>

      {/* Bases Grid */}
      <section className="container mx-auto px-4 mt-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Выберите Вашу <span className="text-primary">Базу</span>
          </h3>
          <p className="text-muted-foreground text-lg">
            Каждая база предлагает уникальные вызовы и навыки для освоения
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {bases.map((base) => (
            <BaseCard
              key={base.id}
              {...base}
              onClick={() => handleBaseClick(base.id)}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 mt-16">
        <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">31 / 200</div>
              <div className="text-muted-foreground">Заданий Завершено</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">1,250</div>
              <div className="text-muted-foreground">Очков Заработано</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">Агент</div>
              <div className="text-muted-foreground">Текущий Ранг</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
