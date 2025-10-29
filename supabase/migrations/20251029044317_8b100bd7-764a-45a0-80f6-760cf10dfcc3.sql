-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Новичок',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  points INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  correct_answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Challenges are publicly readable
CREATE POLICY "Challenges are viewable by everyone"
  ON public.challenges FOR SELECT
  USING (true);

-- Create hints table
CREATE TABLE public.hints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  hint_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  cost INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, hint_number)
);

-- Enable RLS for hints
ALTER TABLE public.hints ENABLE ROW LEVEL SECURITY;

-- Hints are publicly readable
CREATE POLICY "Hints are viewable by everyone"
  ON public.hints FOR SELECT
  USING (true);

-- Create user_progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Enable RLS for user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Create unlocked_hints table
CREATE TABLE public.unlocked_hints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hint_id UUID REFERENCES public.hints(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hint_id)
);

-- Enable RLS for unlocked_hints
ALTER TABLE public.unlocked_hints ENABLE ROW LEVEL SECURITY;

-- Unlocked hints policies
CREATE POLICY "Users can view their unlocked hints"
  ON public.unlocked_hints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock hints"
  ON public.unlocked_hints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert all challenges
INSERT INTO public.challenges (challenge_number, title, description, full_description, difficulty, points, tags, correct_answer) VALUES
(1, 'Взлом Веб-Сайта', 'Найдите уязвимость SQL-инъекции на скомпрометированном сайте и получите доступ к базе данных.', 
'# Миссия: Взлом Веб-Сайта

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
CYBER{...}', 'easy', 100, ARRAY['SQL', 'Web Security', 'Injection'], 'CYBER{SQL_INJECTION_BASIC}'),

(2, 'Шифрование Caesar', 'Расшифруйте перехваченное сообщение, используя классический шифр Цезаря.', 
'# Миссия: Расшифровка Caesar

## Обзор
Мы перехватили зашифрованное сообщение от преступной группировки. Анализ показывает использование шифра Цезаря.

## Зашифрованное сообщение
FDHVDU FLSKHU WZHQWB WKUHH

## Цель
Определить сдвиг и расшифровать сообщение, чтобы получить флаг.

## Подсказки
- Шифр Цезаря использует простой буквенный сдвиг
- Попробуйте все возможные сдвиги (1-25)
- Флаг будет в формате CYBER{...}', 'easy', 80, ARRAY['Cryptography', 'Caesar Cipher', 'Decryption'], 'CYBER{CAESAR_CIPHER_TWENTY_THREE}'),

(3, 'Анализ Сетевого Трафика', 'Проанализируйте захваченный сетевой трафик и найдите скрытые данные.', 
'# Миссия: Анализ Трафика

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
3. Найти флаг в данных', 'medium', 150, ARRAY['Network', 'Forensics', 'Base64'], 'CYBER{NETWORK_FORENSICS_DECODED}'),

(4, 'XSS Уязвимость', 'Найдите и эксплуатируйте XSS уязвимость в веб-приложении.', 
'# Миссия: Cross-Site Scripting

## Обзор
Веб-приложение имеет форму комментариев, которая не фильтрует пользовательский ввод.

## Цель
Создать XSS payload, который:
1. Выполнит JavaScript код
2. Извлечет cookies администратора
3. Получит флаг

## Правила
- Используйте теги <script>
- Payload должен быть минимальным
- Формат флага: CYBER{...}', 'medium', 180, ARRAY['Web Security', 'XSS', 'JavaScript'], 'CYBER{XSS_COOKIE_STEALER}'),

(5, 'Реверс-Инжиниринг', 'Проанализируйте бинарный файл и найдите скрытый ключ.', 
'# Миссия: Реверс-Инжиниринг

## Обзор
Мы захватили исполняемый файл от хакерской группы. Нужно найти ключ активации.

## Hex Dump (фрагмент)
43 59 42 45 52 7B 52 33 56 33 52 53 33 5F 4B 33 59 7D

## Цель
1. Проанализировать hex dump
2. Преобразовать в ASCII
3. Получить флаг', 'hard', 250, ARRAY['Reverse Engineering', 'Binary', 'Hex'], 'CYBER{R3V3RS3_K3Y}'),

(6, 'Брутфорс SSH', 'Взломайте SSH сервер используя словарь паролей.', 
'# Миссия: SSH Брутфорс

## Обзор
Целевой сервер защищен слабым паролем. Используйте брутфорс для получения доступа.

## Словарь паролей
password123
admin2023
qwerty
letmein
cyber2024

## Цель
Найти правильный пароль и получить флаг с сервера.', 'easy', 120, ARRAY['Brute Force', 'SSH', 'Password Cracking'], 'CYBER{SSH_BRUTEFORCE_SUCCESS}'),

(7, 'Анализ Логов', 'Изучите системные логи и найдите признаки несанкционированного доступа.', 
'# Миссия: Анализ Логов

## Обзор
Системные логи показывают подозрительную активность. Найдите доказательства взлома.

## Лог-файлы
2024-01-15 14:23:11 - Login attempt from 192.168.1.50
2024-01-15 14:23:45 - Failed login: admin
2024-01-15 14:24:12 - Login attempt from 10.0.0.100
2024-01-15 14:24:15 - Successful login: root

## Цель
Определить источник атаки и найти флаг.', 'medium', 140, ARRAY['Forensics', 'Logs', 'Detection'], 'CYBER{LOG_ANALYSIS_COMPLETE}'),

(8, 'OSINT Расследование', 'Используйте открытые источники для сбора информации о цели.', 
'# Миссия: OSINT

## Обзор
Соберите информацию о подозреваемом используя публичные источники.

## Цель
Target: @cyberagent2024
Platform: Social Media

## Задачи
1. Найти реальное имя
2. Определить местоположение
3. Собрать связанные аккаунты
4. Получить флаг', 'medium', 160, ARRAY['OSINT', 'Reconnaissance', 'Social Engineering'], 'CYBER{OSINT_INVESTIGATION_SUCCESS}'),

(9, 'Privilege Escalation', 'Повысьте привилегии в скомпрометированной системе Linux.', 
'# Миссия: Повышение Привилегий

## Обзор
Вы получили доступ к системе как обычный пользователь. Получите root доступ.

## Информация
User: lowpriv
System: Ubuntu 20.04
Kernel: 5.4.0-42-generic

## Цель
Найти уязвимость для повышения привилегий до root.', 'hard', 280, ARRAY['Linux', 'Privilege Escalation', 'Exploit'], 'CYBER{ROOT_ACCESS_GRANTED}'),

(10, 'WiFi Взлом', 'Взломайте защищенную WiFi сеть используя WPA2 атаку.', 
'# Миссия: WiFi Взлом

## Обзор
Целевая сеть защищена WPA2. Используйте захват handshake и словарную атаку.

## Информация о цели
SSID: CyberNet_5G
BSSID: 00:11:22:33:44:55
Encryption: WPA2-PSK
Signal: -45 dBm

## Цель
Взломать пароль и получить флаг.', 'hard', 300, ARRAY['Wireless', 'WPA2', 'Cracking'], 'CYBER{WIFI_CRACKED_SUCCESS}'),

(11, 'API Эксплойт', 'Найдите и эксплуатируйте уязвимость в REST API.', 
'# Миссия: API Эксплойт

## Обзор
API endpoint имеет уязвимость инъекции. Эксплуатируйте её для получения данных.

## API Endpoint
GET /api/users?id={user_id}

## Цель
1. Найти уязвимость
2. Обойти аутентификацию
3. Получить флаг из защищенного endpoint', 'medium', 170, ARRAY['API', 'Web Security', 'Injection'], 'CYBER{API_EXPLOIT_COMPLETE}'),

(12, 'Финальное Испытание', 'Комбинированное задание на все навыки кибербезопасности.', 
'# Миссия: Финальный Босс

## Обзор
Это финальное испытание базы стажёров. Используйте все полученные навыки.

## Задачи
1. Взломать веб-приложение
2. Проанализировать сетевой трафик
3. Расшифровать сообщение
4. Получить root доступ
5. Найти финальный флаг

## Цель
Пройти все этапы и получить звание Агента.', 'hard', 500, ARRAY['Final Boss', 'All Skills', 'Challenge'], 'CYBER{FINAL_MISSION_ACCOMPLISHED}');

-- Insert hints for all challenges
INSERT INTO public.hints (challenge_id, hint_number, text, cost) VALUES
-- Challenge 1 hints
((SELECT id FROM public.challenges WHERE challenge_number = 1), 1, 'Попробуйте классическую SQL-инъекцию: '' OR ''1''=''1', 10),
((SELECT id FROM public.challenges WHERE challenge_number = 1), 2, 'Форма входа уязвима к инъекции в поле username', 20),
((SELECT id FROM public.challenges WHERE challenge_number = 1), 3, 'Правильный запрос: admin'' OR ''1''=''1'' --', 50),

-- Challenge 2 hints
((SELECT id FROM public.challenges WHERE challenge_number = 2), 1, 'Попробуйте сдвиг на 3 позиции назад', 15),
((SELECT id FROM public.challenges WHERE challenge_number = 2), 2, 'Расшифрованное сообщение начинается с CAESAR', 30),
((SELECT id FROM public.challenges WHERE challenge_number = 2), 3, 'Правильный ответ: CYBER{CAESAR_CIPHER_TWENTY_THREE}', 40),

-- Challenge 3 hints
((SELECT id FROM public.challenges WHERE challenge_number = 3), 1, 'Payload закодирован в Base64', 20),
((SELECT id FROM public.challenges WHERE challenge_number = 3), 2, 'После декодирования вы увидите HTTP GET запрос', 35),
((SELECT id FROM public.challenges WHERE challenge_number = 3), 3, 'Флаг: CYBER{NETWORK_FORENSICS_DECODED}', 60),

-- Challenge 4 hints
((SELECT id FROM public.challenges WHERE challenge_number = 4), 1, 'Попробуйте простой <script>alert(''XSS'')</script>', 25),
((SELECT id FROM public.challenges WHERE challenge_number = 4), 2, 'Для извлечения cookies используйте document.cookie', 45),
((SELECT id FROM public.challenges WHERE challenge_number = 4), 3, 'Флаг: CYBER{XSS_COOKIE_STEALER}', 70),

-- Challenge 5 hints
((SELECT id FROM public.challenges WHERE challenge_number = 5), 1, 'Hex данные - это ASCII символы', 35),
((SELECT id FROM public.challenges WHERE challenge_number = 5), 2, '43 59 42 45 52 = CYBER в ASCII', 65),
((SELECT id FROM public.challenges WHERE challenge_number = 5), 3, 'Полный флаг: CYBER{R3V3RS3_K3Y}', 100),

-- Challenge 6 hints
((SELECT id FROM public.challenges WHERE challenge_number = 6), 1, 'Пароль связан с темой кибербезопасности', 15),
((SELECT id FROM public.challenges WHERE challenge_number = 6), 2, 'Попробуйте cyber2024', 40),
((SELECT id FROM public.challenges WHERE challenge_number = 6), 3, 'Флаг: CYBER{SSH_BRUTEFORCE_SUCCESS}', 50),

-- Challenge 7 hints
((SELECT id FROM public.challenges WHERE challenge_number = 7), 1, 'Обратите внимание на IP адреса', 20),
((SELECT id FROM public.challenges WHERE challenge_number = 7), 2, 'Успешный вход произошел с подозрительного IP', 40),
((SELECT id FROM public.challenges WHERE challenge_number = 7), 3, 'Флаг: CYBER{LOG_ANALYSIS_COMPLETE}', 60),

-- Challenge 8 hints
((SELECT id FROM public.challenges WHERE challenge_number = 8), 1, 'Начните с поиска username в социальных сетях', 25),
((SELECT id FROM public.challenges WHERE challenge_number = 8), 2, 'Проверьте связанные профили и метаданные изображений', 50),
((SELECT id FROM public.challenges WHERE challenge_number = 8), 3, 'Флаг: CYBER{OSINT_INVESTIGATION_SUCCESS}', 70),

-- Challenge 9 hints
((SELECT id FROM public.challenges WHERE challenge_number = 9), 1, 'Проверьте SUID бинарные файлы', 40),
((SELECT id FROM public.challenges WHERE challenge_number = 9), 2, 'Поищите уязвимости ядра для данной версии', 80),
((SELECT id FROM public.challenges WHERE challenge_number = 9), 3, 'Флаг: CYBER{ROOT_ACCESS_GRANTED}', 120),

-- Challenge 10 hints
((SELECT id FROM public.challenges WHERE challenge_number = 10), 1, 'Используйте aircrack-ng для анализа', 50),
((SELECT id FROM public.challenges WHERE challenge_number = 10), 2, 'Захватите WPA handshake и используйте словарь rockyou.txt', 90),
((SELECT id FROM public.challenges WHERE challenge_number = 10), 3, 'Флаг: CYBER{WIFI_CRACKED_SUCCESS}', 130),

-- Challenge 11 hints
((SELECT id FROM public.challenges WHERE challenge_number = 11), 1, 'Проверьте параметры на SQL инъекцию', 25),
((SELECT id FROM public.challenges WHERE challenge_number = 11), 2, 'Используйте UNION SELECT для извлечения данных', 50),
((SELECT id FROM public.challenges WHERE challenge_number = 11), 3, 'Флаг: CYBER{API_EXPLOIT_COMPLETE}', 75),

-- Challenge 12 hints
((SELECT id FROM public.challenges WHERE challenge_number = 12), 1, 'Начните с самых простых уязвимостей', 80),
((SELECT id FROM public.challenges WHERE challenge_number = 12), 2, 'Комбинируйте техники из предыдущих заданий', 150),
((SELECT id FROM public.challenges WHERE challenge_number = 12), 3, 'Флаг: CYBER{FINAL_MISSION_ACCOMPLISHED}', 250);