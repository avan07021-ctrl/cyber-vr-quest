import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Timer } from "@/components/Timer";
import { HintSystem } from "@/components/HintSystem";
import { VRControls } from "@/components/VRControls";
import { Navigation3D } from "@/components/Navigation3D";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Send, Trophy, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Mock data for challenge details
const challengeDetails = {
  "1": {
    id: "1",
    title: "Взлом Веб-Сайта",
    description: "Найдите уязвимость SQL-инъекции на скомпрометированном сайте и получите доступ к базе данных.",
    fullDescription: `
# Миссия: Взлом Веб-Сайта

## Обзор
Вас наняли для проведения теста на проникновение на веб-сайт компании. Ваша задача - найти и эксплуатировать SQL-инъекцию.

## Цель
Получить доступ к административной панели, используя SQL-инъекцию в форме входа.

## Инструкции
1. Исследуйте форму входа на сайте
2. Попробуйте различные SQL-инъекции
3. Найдите способ обойти аутентификацию
4. Получите флаг из административной панели

## Формат флага
CYBER{...}
    `,
    difficulty: "easy" as const,
    points: 100,
    tags: ["SQL", "Web Security", "Injection"],
    hints: [
      {
        id: "h1",
        text: "Попробуйте классическую SQL-инъекцию: ' OR '1'='1",
        cost: 10,
      },
      {
        id: "h2",
        text: "Форма входа уязвима к инъекции в поле username",
        cost: 20,
      },
      {
        id: "h3",
        text: "Правильный запрос: admin' OR '1'='1' --",
        cost: 50,
      },
    ],
    correctAnswer: "CYBER{SQL_INJECTION_BASIC}",
  },
};

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(true);
  const [answer, setAnswer] = useState("");
  const [availablePoints, setAvailablePoints] = useState(100);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState(false);
  const [vrMode, setVrMode] = useState(false);

  const challenge = challengeDetails[challengeId as keyof typeof challengeDetails];

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass-effect p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Задание не найдено</h2>
          <Button onClick={() => navigate("/base/intern")} variant="cyber">
            Вернуться к заданиям
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    setAttempts((prev) => prev + 1);

    if (answer.trim().toUpperCase() === challenge.correctAnswer) {
      setSolved(true);
      setIsRunning(false);
      toast.success("Поздравляем! Задание выполнено!", {
        description: `Вы заработали ${availablePoints} очков!`,
      });
    } else {
      toast.error("Неверный ответ", {
        description: "Попробуйте ещё раз или используйте подсказки",
      });
    }
  };

  const handleHintUnlock = (hintId: string, cost: number) => {
    setAvailablePoints((prev) => prev - cost);
    toast.info(`Подсказка разблокирована за ${cost} очков`);
  };

  const handleGesture = (gesture: string) => {
    if (gesture === "swipe-left") {
      navigate("/base/intern");
    } else if (gesture === "swipe-right") {
      // Next challenge
    }
  };

  return (
    <div className={`min-h-screen pb-8 ${vrMode ? "vr-enhanced" : ""}`}>
      <Header />
      <VRControls onVRToggle={setVrMode} onGestureDetected={handleGesture} />

      <div className="container mx-auto px-4 pt-24">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/base/intern")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к заданиям
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Challenge header */}
            <Card className="glass-effect p-6 border-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {challenge.title}
                  </h1>
                  <p className="text-muted-foreground">{challenge.description}</p>
                </div>
                <Timer isRunning={isRunning} className="shrink-0" />
              </div>

              <div className="flex gap-2 flex-wrap">
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Challenge description */}
            <Card className="glass-effect p-6">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {challenge.fullDescription}
                </div>
              </div>
            </Card>

            {/* Answer submission */}
            <Card className="glass-effect p-6 border-primary/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Отправить решение
              </h3>

              {!solved ? (
                <>
                  <Textarea
                    placeholder="Введите ваш ответ здесь..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="mb-4 min-h-32 font-mono glass-effect"
                    disabled={solved}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Попытки: {attempts}
                    </div>
                    <Button
                      variant="cyber"
                      onClick={handleSubmit}
                      disabled={!answer.trim() || solved}
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Проверить ответ
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 animate-scale-in">
                  <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-bold mb-2 text-accent">
                    Задание выполнено!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Вы заработали {availablePoints} очков
                  </p>
                  <Button variant="cyber" onClick={() => navigate("/base/intern")}>
                    Следующее задание
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="glass-effect p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Статистика
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Доступные очки</span>
                    <span className="font-semibold">{availablePoints} / {challenge.points}</span>
                  </div>
                  <Progress value={(availablePoints / challenge.points) * 100} />
                </div>

                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Сложность</span>
                    <Badge variant="outline" className="border-accent/50">
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Попытки</span>
                    <span className="font-semibold">{attempts}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Hints */}
            <Card className="glass-effect p-6">
              <HintSystem
                hints={challenge.hints}
                availablePoints={availablePoints}
                onHintUnlock={handleHintUnlock}
              />
            </Card>

            {/* 3D Navigation */}
            {vrMode && (
              <div className="animate-fade-in">
                <Navigation3D />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
