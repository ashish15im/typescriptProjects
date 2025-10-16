// Canvas component for interactive dot manipulation
// Features: 
// 1. Drag and drop dots on the left side
// 2. Removal of dots in the right corner

// Interface for dot objects
interface Dot {
  x: number;
  y: number;
  radius: number;
  color: string;
  isDragging: boolean;
}

// Global variables
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let dots: Dot[] = [];
let draggedDot: Dot | null = null;
let removalZone: { x: number; y: number; width: number; height: number };
let removalButton: HTMLButtonElement;

/**
 * Generates HTML for the canvas component
 * @returns HTML string for the canvas component
 */
export function circle(): string {
  return `
    <div class="canvas-container">
      <div class="canvas-header">
        <h2>Interactive Canvas - Drag & Drop Dots</h2>
        <div class="removal-btn">
          <button id="removal-btn">Removal of Dot ▼</button>
        </div>
      </div>
      <div class="canvas-content">
        <canvas id="dotsCanvas" width="800" height="500"></canvas>
      </div>
    </div>
  `;
}

/**
 * Initialize the canvas and attach event listeners
 */
export function circleListeners(): void {
  canvas = document.getElementById("dotsCanvas") as HTMLCanvasElement;
  removalButton = document.getElementById("removal-btn") as HTMLButtonElement;
  
  if (!canvas) return;
  
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  
  // Define removal zone in the right side
  removalZone = {
    x: canvas.width - 340,
    y: 100,
    width: 240,
    height: 80
  };
  
  // Initialize with some dots on the left side
  createInitialDots();
  
  // Add event listeners
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
  
  // Start the animation loop
  animateCanvas();
}

/**
 * Create initial dots on the canvas
 */
function createInitialDots(): void {
  // Create several sample dots on the left side
  const colors = ["#FF6384", "#9966FF", "#FFCE56", "#4BC0C0", "#FF9F40"];
  
  // First row
  dots.push(
    { x: 210, y: 240, radius: 30, color: "#FF6384", isDragging: false },
    { x: 280, y: 290, radius: 30, color: "#9966FF", isDragging: false },
    { x: 350, y: 300, radius: 30, color: "#FFCE56", isDragging: false },
    { x: 170, y: 350, radius: 30, color: "#FF6384", isDragging: false }
  );
  
  // Second row
  dots.push(
    { x: 250, y: 400, radius: 30, color: "#9966FF", isDragging: false },
    { x: 340, y: 390, radius: 30, color: "#FF9F40", isDragging: false },
    { x: 450, y: 290, radius: 30, color: "#4BC0C0", isDragging: false },
    { x: 310, y: 530, radius: 30, color: "#4BC0C0", isDragging: false }
  );
}

/**
 * Handle mouse down events on the canvas
 */
function handleMouseDown(e: MouseEvent): void {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Check if clicking on an existing dot
  for (let i = dots.length - 1; i >= 0; i--) {
    const dot = dots[i];
    const distance = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2);
    
    if (distance <= dot.radius) {
      dot.isDragging = true;
      draggedDot = dot;
      return;
    }
  }
  
  // If clicking on the left side (not in removal zone), create a new dot
  if (mouseX < canvas.width / 2 && !isInRemovalZone(mouseX, mouseY)) {
    const newDot = {
      x: mouseX,
      y: mouseY,
      radius: 30,
      color: getRandomColor(),
      isDragging: false
    };
    dots.push(newDot);
  }
}

/**
 * Handle mouse move events for dragging dots
 */
function handleMouseMove(e: MouseEvent): void {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Update position of dragged dot
  if (draggedDot) {
    draggedDot.x = mouseX;
    draggedDot.y = mouseY;
  }
  
  // Change cursor style when hovering over dots
  let isOverDot = false;
  for (const dot of dots) {
    const distance = Math.sqrt((mouseX - dot.x) ** 2 + (mouseY - dot.y) ** 2);
    if (distance <= dot.radius) {
      isOverDot = true;
      break;
    }
  }
  
  canvas.style.cursor = isOverDot ? "grab" : "default";
  
  // Change cursor when dragging
  if (draggedDot) {
    canvas.style.cursor = "grabbing";
  }
}

/**
 * Handle mouse up events for releasing dots
 */
function handleMouseUp(e: MouseEvent): void {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Check if dot was dropped in removal zone
  if (draggedDot && isInRemovalZone(mouseX, mouseY)) {
    // Remove the dot
    const index = dots.indexOf(draggedDot);
    if (index !== -1) {
      dots.splice(index, 1);
    }
  }
  
  // Reset dragging state
  if (draggedDot) {
    draggedDot.isDragging = false;
    draggedDot = null;
  }
}

/**
 * Check if coordinates are within the removal zone
 */
function isInRemovalZone(x: number, y: number): boolean {
  return (
    x >= removalZone.x &&
    x <= removalZone.x + removalZone.width &&
    y >= removalZone.y &&
    y <= removalZone.y + removalZone.height
  );
}

/**
 * Animation loop for canvas rendering
 */
function animateCanvas(): void {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Fill background with light blue color
  ctx.fillStyle = "#b7dcec"; // Light blue background
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw a vertical divider
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw removal zone
  ctx.fillStyle = "rgba(200, 200, 200, 0.5)"; // Light gray with transparency
  ctx.fillRect(removalZone.x, removalZone.y, removalZone.width, removalZone.height);
  
  ctx.strokeStyle = "#ff4040"; // Red border
  ctx.lineWidth = 2;
  ctx.strokeRect(removalZone.x, removalZone.y, removalZone.width, removalZone.height);
  
  ctx.fillStyle = "#333";
  ctx.font = "16px Arial";
  ctx.fillText("Removal Zone", removalZone.x + 70, removalZone.y + 45);
  
  // Draw all dots
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = dot.color;
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Continue animation
  requestAnimationFrame(animateCanvas);
}

/**
 * Generate a random color for dots
 */
function getRandomColor(): string {
  const colors = [
    "#FF6384", // Red
    "#36A2EB", // Blue
    "#FFCE56", // Yellow
    "#4BC0C0", // Teal
    "#9966FF", // Purple
    "#FF9F40"  // Orange
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}