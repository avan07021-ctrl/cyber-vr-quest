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
  "2": {
    id: "2",
    title: "Шифрование Caesar",
    description: "Расшифруйте перехваченное сообщение, используя классический шифр Цезаря.",
    fullDescription: `
# Миссия: Расшифровка Caesar

## Обзор
Мы перехватили зашифрованное сообщение от преступной группировки. Анализ показывает использование шифра Цезаря.

## Зашифрованное сообщение
FDHVDU FLSKHU WZHQWB WKUHH

## Цель
Определить сдвиг и расшифровать сообщение, чтобы получить флаг.

## Подсказки
- Шифр Цезаря использует простой буквенный сдвиг
- Попробуйте все возможные сдвиги (1-25)
- Флаг будет в формате CYBER{...}

## Инструменты
Вы можете использовать любые онлайн-инструменты для расшифровки.
    `,
    difficulty: "easy" as const,
    points: 80,
    tags: ["Cryptography", "Caesar Cipher", "Decryption"],
    hints: [
      {
        id: "h1",
        text: "Попробуйте сдвиг на 3 позиции назад",
        cost: 15,
      },
      {
        id: "h2",
        text: "Расшифрованное сообщение начинается с CAESAR",
        cost: 30,
      },
      {
        id: "h3",
        text: "Правильный ответ: CYBER{CAESAR_CIPHER_TWENTY_THREE}",
        cost: 40,
      },
    ],
    correctAnswer: "CYBER{CAESAR_CIPHER_TWENTY_THREE}",
  },
  "3": {
    id: "3",
    title: "Анализ Сетевого Трафика",
    description: "Проанализируйте захваченный сетевой трафик и найдите скрытые данные.",
    fullDescription: `
# Миссия: Анализ Трафика

## Обзор
Мы захватили подозрительный сетевой трафик. Ваша задача - найти скрытую информацию.

## Данные пакета
Source IP: 192.168.1.100
Destination IP: 10.0.0.5
Protocol: HTTP
Payload: R0VUICAvaGlkZGVuL2RhdGEuaHRtbCBIVFRQLzEuMQ==

## Цель
1. Декодировать payload (Base64)
2. Определить скрытый URL
3. Найти флаг в данных

## Инструменты
- Base64 decoder
- Wireshark (концептуально)
    `,
    difficulty: "medium" as const,
    points: 150,
    tags: ["Network", "Forensics", "Base64"],
    hints: [
      {
        id: "h1",
        text: "Payload закодирован в Base64",
        cost: 20,
      },
      {
        id: "h2",
        text: "После декодирования вы увидите HTTP GET запрос",
        cost: 35,
      },
      {
        id: "h3",
        text: "Флаг: CYBER{NETWORK_FORENSICS_DECODED}",
        cost: 60,
      },
    ],
    correctAnswer: "CYBER{NETWORK_FORENSICS_DECODED}",
  },
  "4": {
    id: "4",
    title: "XSS Уязвимость",
    description: "Найдите и эксплуатируйте XSS уязвимость в веб-приложении.",
    fullDescription: `
# Миссия: Cross-Site Scripting

## Обзор
Веб-приложение имеет форму комментариев, которая не фильтрует пользовательский ввод.

## Цель
Создать XSS payload, который:
1. Выполнит JavaScript код
2. Извлечет cookies администратора
3. Получит флаг

## Тестовая форма
Форма принимает текстовый ввод и отображает его на странице без фильтрации.

## Правила
- Используйте теги <script>
- Payload должен быть минимальным
- Формат флага: CYBER{...}
    `,
    difficulty: "medium" as const,
    points: 180,
    tags: ["Web Security", "XSS", "JavaScript"],
    hints: [
      {
        id: "h1",
        text: "Попробуйте простой <script>alert('XSS')</script>",
        cost: 25,
      },
      {
        id: "h2",
        text: "Для извлечения cookies используйте document.cookie",
        cost: 45,
      },
      {
        id: "h3",
        text: "Флаг: CYBER{XSS_COOKIE_STEALER}",
        cost: 70,
      },
    ],
    correctAnswer: "CYBER{XSS_COOKIE_STEALER}",
  },
  "5": {
    id: "5",
    title: "Реверс-Инжиниринг",
    description: "Проанализируйте бинарный файл и найдите скрытый ключ.",
    fullDescription: `
# Миссия: Реверс-Инжиниринг

## Обзор
Мы захватили исполняемый файл от хакерской группы. Нужно найти ключ активации.

## Информация о файле
- Тип: ELF 64-bit
- Архитектура: x86-64
- Защита: Базовая обфускация

## Hex Dump (фрагмент)
43 59 42 45 52 7B 52 33 56 33 52 53 33 5F 4B 33 59 7D

## Цель
1. Проанализировать hex dump
2. Преобразовать в ASCII
3. Получить флаг

## Инструменты
Hex to ASCII converter
    `,
    difficulty: "hard" as const,
    points: 250,
    tags: ["Reverse Engineering", "Binary", "Hex"],
    hints: [
      {
        id: "h1",
        text: "Hex данные - это ASCII символы",
        cost: 35,
      },
      {
        id: "h2",
        text: "43 59 42 45 52 = CYBER в ASCII",
        cost: 65,
      },
      {
        id: "h3",
        text: "Полный флаг: CYBER{R3V3RS3_K3Y}",
        cost: 100,
      },
    ],
    correctAnswer: "CYBER{R3V3RS3_K3Y}",
  },
  "6": {
    id: "6",
    title: "Брутфорс SSH",
    description: "Взломайте SSH сервер используя словарь паролей.",
    fullDescription: `
# Миссия: SSH Брутфорс

## Обзор
Целевой сервер защищен слабым паролем. Используйте брутфорс для получения доступа.

## Информация о цели
- Host: 192.168.100.50
- Port: 22
- Username: admin
- Password: ? (из словаря)

## Словарь паролей
password123
admin2023
qwerty
letmein
cyber2024

## Цель
Найти правильный пароль и получить флаг с сервера.
    `,
    difficulty: "easy" as const,
    points: 120,
    tags: ["Brute Force", "SSH", "Password Cracking"],
    hints: [
      {
        id: "h1",
        text: "Пароль связан с темой кибербезопасности",
        cost: 15,
      },
      {
        id: "h2",
        text: "Попробуйте cyber2024",
        cost: 40,
      },
      {
        id: "h3",
        text: "Флаг: CYBER{SSH_BRUTEFORCE_SUCCESS}",
        cost: 50,
      },
    ],
    correctAnswer: "CYBER{SSH_BRUTEFORCE_SUCCESS}",
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
