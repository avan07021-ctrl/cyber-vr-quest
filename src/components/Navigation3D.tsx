import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

export const Navigation3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(5);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / (2 * window.devicePixelRatio);
      const centerY = canvas.height / (2 * window.devicePixelRatio);

      // Draw 3D grid
      ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
      ctx.lineWidth = 1;

      const gridSize = 10;
      const spacing = 30 * (zoom / 5);

      for (let i = -gridSize; i <= gridSize; i++) {
        // Horizontal lines
        const y = centerY + i * spacing + Math.sin(rotation.x) * 20;
        ctx.beginPath();
        ctx.moveTo(centerX - gridSize * spacing, y);
        ctx.lineTo(centerX + gridSize * spacing, y);
        ctx.stroke();

        // Vertical lines
        const x = centerX + i * spacing + Math.sin(rotation.y) * 20;
        ctx.beginPath();
        ctx.moveTo(x, centerY - gridSize * spacing);
        ctx.lineTo(x, centerY + gridSize * spacing);
        ctx.stroke();
      }

      // Draw center cube
      const cubeSize = 40;
      ctx.strokeStyle = "rgba(138, 43, 226, 0.8)";
      ctx.lineWidth = 2;

      const rotatePoint = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Project to 2D
        const scale = 200 / (200 + z2);
        return {
          x: centerX + x1 * scale * (zoom / 5),
          y: centerY + y1 * scale * (zoom / 5),
        };
      };

      // Cube vertices
      const vertices = [
        [-cubeSize, -cubeSize, -cubeSize],
        [cubeSize, -cubeSize, -cubeSize],
        [cubeSize, cubeSize, -cubeSize],
        [-cubeSize, cubeSize, -cubeSize],
        [-cubeSize, -cubeSize, cubeSize],
        [cubeSize, -cubeSize, cubeSize],
        [cubeSize, cubeSize, cubeSize],
        [-cubeSize, cubeSize, cubeSize],
      ];

      const projected = vertices.map((v) => rotatePoint(v[0], v[1], v[2]));

      // Draw cube edges
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Back face
        [4, 5], [5, 6], [6, 7], [7, 4], // Front face
        [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
      ];

      ctx.strokeStyle = "rgba(0, 255, 255, 0.8)";
      ctx.lineWidth = 2;

      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(projected[start].x, projected[start].y);
        ctx.lineTo(projected[end].x, projected[end].y);
        ctx.stroke();
      });

      // Glow effect
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
      edges.forEach(([start, end]) => {
        ctx.beginPath();
        ctx.moveTo(projected[start].x, projected[start].y);
        ctx.lineTo(projected[end].x, projected[end].y);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    };

    draw();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      draw();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [rotation, zoom]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;

    setRotation((prev) => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01,
    }));

    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleReset = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(5);
  };

  return (
    <Card className="glass-effect p-4 border-primary/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">3D Навигация</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.max(2, zoom - 1))}
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setZoom(Math.min(10, zoom + 1))}
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleReset}
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-48 rounded-lg cursor-move bg-background/50"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <p className="text-xs text-muted-foreground mt-2 text-center">
        Перетаскивайте для вращения
      </p>
    </Card>
  );
};
