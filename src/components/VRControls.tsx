import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Glasses, Hand, Navigation, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";

interface VRControlsProps {
  onVRToggle: (enabled: boolean) => void;
  onGestureDetected?: (gesture: string) => void;
}

export const VRControls = ({ onVRToggle, onGestureDetected }: VRControlsProps) => {
  const [vrMode, setVrMode] = useState(false);
  const [stereoMode, setStereoMode] = useState(false);
  const [gestureControl, setGestureControl] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Gesture detection simulation (swipe left/right/up/down)
  useEffect(() => {
    if (!gestureControl) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const diffX = endX - startX;
      const diffY = endY - startY;
      
      const threshold = 50;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold) {
          const gesture = diffX > 0 ? "swipe-right" : "swipe-left";
          onGestureDetected?.(gesture);
          toast.success(`Жест: ${gesture === "swipe-right" ? "Свайп вправо" : "Свайп влево"}`);
        }
      } else {
        if (Math.abs(diffY) > threshold) {
          const gesture = diffY > 0 ? "swipe-down" : "swipe-up";
          onGestureDetected?.(gesture);
          toast.success(`Жест: ${gesture === "swipe-up" ? "Свайп вверх" : "Свайп вниз"}`);
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gestureControl, onGestureDetected]);

  const toggleVR = () => {
    const newVRMode = !vrMode;
    setVrMode(newVRMode);
    onVRToggle(newVRMode);
    
    if (newVRMode) {
      document.body.classList.add("vr-mode");
      toast.success("VR режим активирован");
    } else {
      document.body.classList.remove("vr-mode");
      setStereoMode(false);
      toast.info("VR режим деактивирован");
    }
  };

  const toggleStereo = () => {
    if (!vrMode) {
      toast.error("Сначала активируйте VR режим");
      return;
    }
    
    const newStereoMode = !stereoMode;
    setStereoMode(newStereoMode);
    
    if (newStereoMode) {
      document.body.classList.add("stereo-mode");
      toast.success("Стереоскопический режим включен");
    } else {
      document.body.classList.remove("stereo-mode");
      toast.info("Стереоскопический режим выключен");
    }
  };

  const toggleGestures = () => {
    const newGestureMode = !gestureControl;
    setGestureControl(newGestureMode);
    
    if (newGestureMode) {
      toast.success("Управление жестами активировано. Используйте свайпы!");
    } else {
      toast.info("Управление жестами деактивировано");
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        toast.success("Полноэкранный режим активирован");
      } else {
        await document.exitFullscreen();
        toast.info("Полноэкранный режим деактивирован");
      }
    } catch (error) {
      toast.error("Не удалось переключить полноэкранный режим");
    }
  };

  return (
    <div className="fixed top-24 right-4 z-40 space-y-3">
      <div className="glass-effect rounded-xl p-4 space-y-3 border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Glasses className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">VR Управление</span>
        </div>

        <Button
          variant={vrMode ? "cyber" : "outline"}
          size="sm"
          onClick={toggleVR}
          className="w-full"
        >
          <Glasses className="w-4 h-4 mr-2" />
          {vrMode ? "VR: Вкл" : "VR: Выкл"}
        </Button>

        <Button
          variant={stereoMode ? "cyber" : "outline"}
          size="sm"
          onClick={toggleStereo}
          disabled={!vrMode}
          className="w-full"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Стерео 3D
        </Button>

        <Button
          variant={gestureControl ? "cyber" : "outline"}
          size="sm"
          onClick={toggleGestures}
          className="w-full"
        >
          <Hand className="w-4 h-4 mr-2" />
          Жесты
        </Button>

        <Button
          variant={isFullscreen ? "cyber" : "outline"}
          size="sm"
          onClick={toggleFullscreen}
          className="w-full"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 mr-2" />
          ) : (
            <Maximize2 className="w-4 h-4 mr-2" />
          )}
          {isFullscreen ? "Выход" : "Полный экран"}
        </Button>

        {vrMode && (
          <div className="pt-2 space-y-1 border-t border-primary/20 animate-fade-in">
            <Badge variant="outline" className="w-full justify-center border-accent/50 text-xs">
              VR режим активен
            </Badge>
            {gestureControl && (
              <Badge variant="outline" className="w-full justify-center border-primary/50 text-xs">
                Свайпы работают
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
