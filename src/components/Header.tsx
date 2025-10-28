import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Trophy, User, Shield } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-10 h-10 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CyberStart VR
              </h1>
              <p className="text-xs text-muted-foreground">Агентство Киберзащиты</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            <Badge variant="outline" className="border-primary/50 px-4 py-2">
              <Trophy className="w-4 h-4 mr-2 text-accent" />
              <span className="font-semibold">1,250</span>
              <span className="text-muted-foreground ml-1">очков</span>
            </Badge>
            <Badge variant="outline" className="border-secondary/50 px-4 py-2">
              <span className="font-semibold">Ранг:</span>
              <span className="ml-2 text-secondary">Агент</span>
            </Badge>
          </div>

          {/* User */}
          <Button variant="ghost" size="icon" className="relative">
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
};
