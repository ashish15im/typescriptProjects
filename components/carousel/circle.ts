export const canvas = (): string => {
  return `
    <div class="container">
      <div class="canvas-container">
        <div class="dots-panel" id="dotsPanel">
          <h3>Drag Dots to Circle</h3>          
          <div class="dot" draggable="true" id="dot1">•</div>          
        </div>
        
        <div class="dot-removal-panel" id="dotRemovalPanel">
          <h3>Dot Management</h3>
          <div class="dot-count" id="dotCount">Dots on circle: 0</div>
          <button id="removeSelectedDot">Remove Selected Dot</button>
          <button id="removeAllDots">Remove All Dots</button>
        </div>
        
        <div class="canvas-wrapper">
          <canvas id="circleCanvas" width="1000" height="390"></canvas>
          <p></p>
          <div id="placedDots"></div>
          
        </div>
      </div>
    </div>
  `
}

// Update the canvasListeners function to modify how dots are placed and styled
export const canvasListeners = (): void => {
  const canvas = document.querySelector("#circleCanvas") as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Get the dot removal panel
  const dotRemovalPanel = document.querySelector("#dotRemovalPanel") as HTMLElement
const dotCountElement = document.querySelector("#dotCount") as HTMLElement
const removeSelectedDotButton = document.querySelector("#removeSelectedDot") as HTMLButtonElement
const removeAllDotsButton = document.querySelector("#removeAllDots") as HTMLButtonElement


  // Convert 5cm to pixels (1 inch = 2.54cm, 1 inch = 96px)
  const cmToPixels = (cm: number): number => (cm / 2.54) * 96
  const radiusInPixels = cmToPixels(5)

  // Set circle properties - CENTER OF CANVAS
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  // Store placed dots for redrawing
  const placedDotPositions: { angle: number; color: string }[] = []

  // Track selected dot
  let selectedDotIndex: number | null = null

  // Function to update dot removal panel visibility
  function updateDotRemovalPanel(): void {
    if (placedDotPositions.length > 0) {
      dotRemovalPanel.style.display = "block"
      dotCountElement.textContent = `Dots on circle: ${placedDotPositions.length}`

      // Enable/disable remove selected dot button based on selection
      if (selectedDotIndex !== null) {
        removeSelectedDotButton.disabled = false
        removeSelectedDotButton.textContent = `Remove Dot #${selectedDotIndex + 1}`
      } else {
        removeSelectedDotButton.disabled = true
        removeSelectedDotButton.textContent = "Select a dot to remove"
      }
    } else {
      dotRemovalPanel.style.display = "none"
      selectedDotIndex = null
    }
  }

  // Function to calculate equally spaced positions for dots
  function calculateEquallySpacedPositions(numDots: number): number[] {
    const angles: number[] = []
    // Calculate angle increment for equal spacing (in radians)
    const angleIncrement = (2 * Math.PI) / numDots

    // Start from 0 radians (right side of circle) and distribute dots evenly
    for (let i = 0; i < numDots; i++) {
      angles.push(i * angleIncrement)
    }

    return angles
  }

  // Function to redistribute all dots with equal spacing
  function redistributeDots(): void {
    if (placedDotPositions.length === 0) return

    // Calculate new equally spaced angles
    const newAngles = calculateEquallySpacedPositions(placedDotPositions.length)

    // Update each dot's angle while preserving its color
    for (let i = 0; i < placedDotPositions.length; i++) {
      placedDotPositions[i].angle = newAngles[i]
    }

    // Redraw the circle with updated positions
    drawCircle()

    // Update dot removal panel
    updateDotRemovalPanel()
  }

  // Function to draw the circle and all dots
  function drawCircle(highlightAngle: number | null = null): void {
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radiusInPixels, 0, Math.PI * 2)
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.stroke()

    // If there are dots, draw markers for equally spaced positions
    if (placedDotPositions.length > 0) {
      // Draw faint markers for potential positions
      const potentialPositions = calculateEquallySpacedPositions(placedDotPositions.length + 1)
      potentialPositions.forEach((angle) => {
        const x = centerX + radiusInPixels * Math.cos(angle)
        const y = centerY + radiusInPixels * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(100, 100, 100, 0.3)"
        ctx.fill()
      })
    }

    // Draw all placed dots directly on the canvas
    placedDotPositions.forEach((dot, index) => {
      const position = getPositionFromAngle(dot.angle)

      // Draw dot on the circle
      ctx.beginPath()
      ctx.arc(position.x, position.y, 6, 0, Math.PI * 2)

      // If this dot is selected, draw it with a highlight
      if (index === selectedDotIndex) {
        ctx.fillStyle = "#4338ca" // Indigo color for selected dot
        ctx.fill()
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw selection indicator
        ctx.beginPath()
        ctx.arc(position.x, position.y, 12, 0, Math.PI * 2)
        ctx.strokeStyle = "#4338ca"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw dot number
        ctx.font = "12px Arial"
        ctx.fillStyle = "#4338ca"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`#${index + 1}`, position.x, position.y - 20)
      } else {
        ctx.fillStyle = dot.color
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw dot number with smaller font
        ctx.font = "10px Arial"
        ctx.fillStyle = "#666"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`#${index + 1}`, position.x, position.y - 15)
      }
    })

    // Draw highlight if provided
    if (highlightAngle !== null) {
      const highlightX = centerX + radiusInPixels * Math.cos(highlightAngle)
      const highlightY = centerY + radiusInPixels * Math.sin(highlightAngle)

      ctx.beginPath()
      ctx.arc(highlightX, highlightY, 8, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(22, 17, 17, 0.5)"
      ctx.fill()
    }
  }

  // Initial draw
  drawCircle()

  // Function to get angle from mouse position
  function getAngleFromMouse(mouseX: number, mouseY: number): number {
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    return Math.atan2(dy, dx)
  }

  // Function to get position on circumference from angle
  function getPositionFromAngle(angle: number): { x: number; y: number } {
    return {
      x: centerX + radiusInPixels * Math.cos(angle),
      y: centerY + radiusInPixels * Math.sin(angle),
    }
  }

  // Function to calculate distance between two points
  function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // Function to check if a point is near the circle (with tolerance)
  function isNearCircle(x: number, y: number, tolerance = 20): boolean {
    const distance = getDistance(x, y, centerX, centerY)
    return Math.abs(distance - radiusInPixels) <= tolerance
  }

  // Function to find the closest valid position angle
  function findClosestValidPosition(angle: number): number {
    if (placedDotPositions.length === 0) return angle

    // Calculate equally spaced positions
    const validPositions = calculateEquallySpacedPositions(placedDotPositions.length + 1)

    // Find the closest valid position
    let closestAngle = validPositions[0]
    let minDifference = Math.abs(normalizeAngle(angle - validPositions[0]))

    for (let i = 1; i < validPositions.length; i++) {
      const difference = Math.abs(normalizeAngle(angle - validPositions[i]))
      if (difference < minDifference) {
        minDifference = difference
        closestAngle = validPositions[i]
      }
    }

    return closestAngle
  }

  // Normalize angle to be between -π and π
  function normalizeAngle(angle: number): number {
    return ((angle + Math.PI) % (2 * Math.PI)) - Math.PI
  }

  // Get tooltip element
  const tooltip = document.querySelector("#circleTooltip") as HTMLElement

  // Set up drag and drop for dots
  const dots = document.querySelectorAll(".dot")
  dots.forEach((dot) => {
    // Fix the dragstart event listener by using the correct type
    dot.addEventListener("dragstart", (e: Event) => {
      const dragEvent = e as DragEvent
      const target = dragEvent.target as HTMLElement
      dragEvent.dataTransfer!.setData("text/plain", target.id)

      // Get computed style to pass the color
      const computedStyle = window.getComputedStyle(target)
      dragEvent.dataTransfer!.setData("color", computedStyle.backgroundColor)
    })
  })

  // Track current highlight angle during drag
  let currentHighlightAngle: number | null = null

  // Show tooltip function
  function showTooltip(x: number, y: number, text: string): void {
    if (!tooltip) return

    tooltip.textContent = text
    tooltip.style.display = "block"
    tooltip.style.left = `${x + 15}px`
    tooltip.style.top = `${y + 15}px`
  }

  // Hide tooltip function
  function hideTooltip(): void {
    if (!tooltip) return
    tooltip.style.display = "none"
  }

  // Handle drag over canvas - show where dot would be placed
  // Fix the dragover event listener
  canvas.addEventListener("dragover", (e: Event) => {
    const dragEvent = e as DragEvent
    dragEvent.preventDefault()

    const rect = canvas.getBoundingClientRect()
    const mouseX = dragEvent.clientX - rect.left
    const mouseY = dragEvent.clientY - rect.top

    // Only allow drop near the circle
    if (isNearCircle(mouseX, mouseY)) {
      // Calculate angle from mouse position
      const mouseAngle = getAngleFromMouse(mouseX, mouseY)

      // Find the closest valid position for equal spacing
      currentHighlightAngle = findClosestValidPosition(mouseAngle)

      // Draw circle with highlight
      drawCircle(currentHighlightAngle)

      // Allow drop
      canvas.style.cursor = "pointer"
      dragEvent.dataTransfer!.dropEffect = "copy"

      // Show tooltip with angle info
      const angleDegrees = Math.round(((currentHighlightAngle * 180) / Math.PI + 360) % 360)
      showTooltip(mouseX, mouseY, `Position: ${angleDegrees}°`)
    } else {
      // Not near circle, don't allow drop
      currentHighlightAngle = null
      drawCircle()
      canvas.style.cursor = "not-allowed"
      dragEvent.dataTransfer!.dropEffect = "none"
      hideTooltip()
    }
  })

  // Reset highlight when drag leaves canvas
  // Fix the dragleave event listener
  canvas.addEventListener("dragleave", () => {
    currentHighlightAngle = null
    drawCircle()
    canvas.style.cursor = "default"
    hideTooltip()
  })

  // Handle drop on canvas
  // Fix the drop event listener
  canvas.addEventListener("drop", (e: Event) => {
    const dragEvent = e as DragEvent
    dragEvent.preventDefault()
    canvas.style.cursor = "default"
    hideTooltip()

    // Only proceed if we have a valid highlight angle
    if (currentHighlightAngle === null) return

    // Get the dot ID and color
    const dotId = dragEvent.dataTransfer!.getData("text/plain")
    const dotColor = dragEvent.dataTransfer!.getData("color") || "#ff0000"

    // Add dot to the placedDotPositions array
    placedDotPositions.push({
      angle: currentHighlightAngle,
      color: dotColor,
    })

    // Reset highlight
    currentHighlightAngle = null

    // Redistribute all dots to ensure equal spacing
    redistributeDots()

    // Make the canvas clickable for dot manipulation
    setupCanvasClickListener()

    // Update dot removal panel
    updateDotRemovalPanel()
  })

  // Function to set up canvas click listener for dot manipulation
  function setupCanvasClickListener(): void {
    // Remove existing listener if any
    canvas.removeEventListener("click", handleCanvasClick)

    // Add new listener
    canvas.addEventListener("click", handleCanvasClick)
  }

  // Handle canvas click for dot manipulation
  function handleCanvasClick(e: MouseEvent): void {
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate angle from mouse position
    const clickAngle = getAngleFromMouse(mouseX, mouseY)

    // Get position on circle from angle
    const clickPosition = getPositionFromAngle(clickAngle)

    // Check if click is near any existing dot
    const dotIndex = findDotNearPosition(clickPosition.x, clickPosition.y)

    if (dotIndex !== -1) {
      // Toggle selection of the dot
      if (selectedDotIndex === dotIndex) {
        selectedDotIndex = null
      } else {
        selectedDotIndex = dotIndex
      }

      // Update the UI
      drawCircle()
      updateDotRemovalPanel()
    } else {
      // If clicked elsewhere, clear selection
      selectedDotIndex = null
      drawCircle()
      updateDotRemovalPanel()
    }
  }

  // Find dot near position
  function findDotNearPosition(x: number, y: number, tolerance = 10): number {
    for (let i = 0; i < placedDotPositions.length; i++) {
      const position = getPositionFromAngle(placedDotPositions[i].angle)
      const distance = getDistance(x, y, position.x, position.y)

      if (distance <= tolerance) {
        return i
      }
    }

    return -1
  }

  // Start dragging a dot
  function startDraggingDot(dotIndex: number, initialEvent: MouseEvent): void {
    let isDragging = true
    const originalPositions: { angle: number; color: string }[] = JSON.parse(JSON.stringify(placedDotPositions))

    // Function to handle mouse move during drag
    function handleDotDrag(e: MouseEvent): void {
      if (!isDragging) return

      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate new angle
      const mouseAngle = getAngleFromMouse(mouseX, mouseY)

      // Find the closest valid position for equal spacing
      // We temporarily remove the current dot to calculate positions
      const tempDots = [...placedDotPositions]
      tempDots.splice(dotIndex, 1)

      // Calculate new equally spaced positions including the position for the dragged dot
      const newPositions = calculateEquallySpacedPositions(placedDotPositions.length)

      // Find the closest valid position to where the user is dragging
      let closestPositionIndex = 0
      let minDifference = Math.abs(normalizeAngle(mouseAngle - newPositions[0]))

      for (let i = 1; i < newPositions.length; i++) {
        const difference = Math.abs(normalizeAngle(mouseAngle - newPositions[i]))
        if (difference < minDifference) {
          minDifference = difference
          closestPositionIndex = i
        }
      }

      // Rotate the positions array so the closest position is at the dotIndex
      const rotationOffset = (closestPositionIndex - dotIndex + placedDotPositions.length) % placedDotPositions.length
      const rotatedPositions = [...newPositions]

      if (rotationOffset > 0) {
        // Rotate the array
        for (let i = 0; i < rotationOffset; i++) {
          rotatedPositions.unshift(rotatedPositions.pop()!)
        }
      }

      // Update all dot positions
      for (let i = 0; i < placedDotPositions.length; i++) {
        placedDotPositions[i].angle = rotatedPositions[i]
      }

      // Redraw
      drawCircle()

      // Show tooltip
      const angleDegrees = Math.round(((placedDotPositions[dotIndex].angle * 180) / Math.PI + 360) % 360)
      showTooltip(mouseX, mouseY, `Position: ${angleDegrees}°`)
    }

    // Function to handle mouse up
    function handleDotDragEnd(): void {
      isDragging = false
      document.removeEventListener("mousemove", handleDotDrag)
      document.removeEventListener("mouseup", handleDotDragEnd)
      hideTooltip()
    }

    // Add event listeners
    document.addEventListener("mousemove", handleDotDrag)
    document.addEventListener("mouseup", handleDotDragEnd)

    // Initial drag update
    handleDotDrag(initialEvent)
  }

  // Set up event listeners for dot removal panel buttons
  removeSelectedDotButton.addEventListener("click", () => {
    if (selectedDotIndex !== null) {
      // Remove the selected dot
      placedDotPositions.splice(selectedDotIndex, 1)
      selectedDotIndex = null

      // Redistribute remaining dots
      redistributeDots()

      // Update UI
      updateDotRemovalPanel()
    }
  })

  removeAllDotsButton.addEventListener("click", () => {
    // Remove all dots
    placedDotPositions.length = 0
    selectedDotIndex = null

    // Update UI
    drawCircle()
    updateDotRemovalPanel()
  })

  // Initialize dot removal panel
  updateDotRemovalPanel()
}
