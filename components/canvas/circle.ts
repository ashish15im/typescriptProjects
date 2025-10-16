export const canvas = (): string => {
  return `
    <div class="container">
      <div class="canvas-container">
        <!-- Tools panel on the left side -->
        <div class="tools-panel" id="toolsPanel">
          <h3>Tools</h3>
          
          <!-- First dropdown for actions -->
          <div class="dropdown-container">
            <select id="dotAction" class="action-dropdown">
              <option value="add">Add a dot</option>
              <option value="remove">Remove a dot</option>
            </select>
          </div>
          
          <!-- Second dropdown that contains the draggable dot -->
          <div class="dropdown-container">
            <select id="dotDropdown" class="dot-dropdown">
              <option value="">Drag a dot</option>
            </select>
            <!-- The dot is positioned to appear like it's part of the dropdown -->
            <div class="dropdown-dot-container" id="dotContainer">
              <div class="dot" draggable="true" id="dot1">•</div>
            </div>
          </div>
        </div>
        
        <!-- Dot management panel on the right side -->
        <div class="dot-management-panel" id="dotManagementPanel">
          <h3>Dot Management</h3>
          <div id="dotCount">Dots on circle: 0</div>
          <select id="dotSelector" style="display: none;">
            <option value="">Select a dot to remove</option>
          </select>
          <button id="removeSelectedDot">Remove Selected Dot</button>
          <button id="removeAllDots">Remove All Dots</button>
        </div>
        
        <div class="canvas-wrapper">
          <canvas id="circleCanvas" width="1000" height="390"></canvas>
          <div id="placedDots"></div>
          <div id="circleTooltip" class="circle-tooltip"></div>
        </div>
      </div>
    </div>
  `
}

// Update the canvasListeners function to implement the dropdown functionality
export const canvasListeners = (): void => {
  const canvas = document.querySelector("#circleCanvas") as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Get UI elements
  const dotManagementPanel = document.querySelector("#dotManagementPanel") as HTMLElement
  const dotCountElement = document.querySelector("#dotCount") as HTMLElement
  const removeSelectedDotButton = document.querySelector("#removeSelectedDot") as HTMLButtonElement
  const removeAllDotsButton = document.querySelector("#removeAllDots") as HTMLButtonElement
  const dotSelector = document.querySelector("#dotSelector") as HTMLSelectElement
  const dotActionDropdown = document.querySelector("#dotAction") as HTMLSelectElement
  const dotDropdown = document.querySelector("#dotDropdown") as HTMLSelectElement
  const dotContainer = document.querySelector("#dotContainer") as HTMLElement

  // Toggle dot container visibility when dropdown is clicked
  dotDropdown.addEventListener("click", (e) => {
    e.preventDefault() // Prevent the dropdown from actually opening
    dotContainer.style.display = dotContainer.style.display === "block" ? "none" : "block"
  })

  // Close the dot container when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target !== dotDropdown && !dotContainer.contains(e.target as Node)) {
      dotContainer.style.display = "none"
    }
  })

  // Convert 5cm to pixels (1 inch = 2.54cm, 1 inch = 96px)
  const cmToPixels = (cm: number): number => (cm / 2.54) * 96
  const radiusInPixels = cmToPixels(4)

  // Set circle properties - CENTER OF CANVAS
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  // Store placed dots for redrawing
  const placedDotPositions: { angle: number; color: string }[] = []

  // Track selected dot
  let selectedDotIndex: number | null = null

  // Track current action mode from dropdown
  let currentAction = "add"

  // Function to update dot management panel
  function updateDotManagementPanel(): void {
    if (placedDotPositions.length > 0) {
      dotManagementPanel.style.display = "block"
      dotCountElement.textContent = `Dots on circle: ${placedDotPositions.length}`

      // Update dot selector dropdown
      dotSelector.innerHTML = '<option value="">Select a dot to remove</option>'
      placedDotPositions.forEach((_, index) => {
        const option = document.createElement("option")
        option.value = index.toString()
        option.textContent = `Dot #${index + 1}`
        dotSelector.appendChild(option)
      })

      // Show selector if in remove mode
      if (currentAction === "remove") {
        dotSelector.style.display = "block"
      } else {
        dotSelector.style.display = "none"
      }
    } else {
      dotManagementPanel.style.display = "none"
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

    // Update dot management panel
    updateDotManagementPanel()
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
    if (placedDotPositions.length > 0 && currentAction === "add") {
      // Draw faint markers for potential positions
      const potentialPositions = calculateEquallySpacedPositions(placedDotPositions.length + 1)
      potentialPositions.forEach((angle) => {
        const x = centerX + radiusInPixels * Math.cos(angle)
        const y = centerY + radiusInPixels * Math.sin(angle)

        ctx.beginPath()
        ctx.arc(x, y, 1, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(100, 100, 100, 0.3)"
        ctx.fill()
      })
    }

    // Draw all placed dots directly on the canvas
    placedDotPositions.forEach((dot, index) => {
      const position = getPositionFromAngle(dot.angle)

      // Draw dot on the circle
      ctx.beginPath()
      ctx.arc(position.x, position.y, 4, 0, Math.PI * 2)

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
    dot.addEventListener("dragstart", (e: Event) => {
      const dragEvent = e as DragEvent
      const target = dragEvent.target as HTMLElement
      dragEvent.dataTransfer!.setData("text/plain", target.id)

      // Get computed style to pass the color
      const computedStyle = window.getComputedStyle(target)
      dragEvent.dataTransfer!.setData("color", computedStyle.backgroundColor)

      // Hide the dot container when dragging starts
      dotContainer.style.display = "none"
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
  canvas.addEventListener("dragleave", () => {
    currentHighlightAngle = null
    drawCircle()
    canvas.style.cursor = "default"
    hideTooltip()
  })

  // Handle drop on canvas
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

    // Update dot management panel
    updateDotManagementPanel()
  })

  // Handle canvas click for different actions
  canvas.addEventListener("click", (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate angle from mouse position
    const clickAngle = getAngleFromMouse(mouseX, mouseY)

    // Get position on circle from angle
    const clickPosition = getPositionFromAngle(clickAngle)

    // Check if click is near the circle
    if (!isNearCircle(mouseX, mouseY)) return

    // Handle different actions based on dropdown selection
    switch (currentAction) {
      case "add":
        // Add a new dot at the closest valid position
        const newAngle = findClosestValidPosition(clickAngle)
        placedDotPositions.push({
          angle: newAngle,
          color: "#ff0000", // Default color
        })
        redistributeDots()
        break

      case "remove":
        // Check if click is near any existing dot
        const dotIndex = findDotNearPosition(clickPosition.x, clickPosition.y)
        if (dotIndex !== -1) {
          // Remove the dot
          placedDotPositions.splice(dotIndex, 1)
          selectedDotIndex = null
          redistributeDots()
        }
        break
    }

    // Update the UI
    updateDotManagementPanel()
  })

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

  // Set up event listeners for dot management panel buttons
  removeSelectedDotButton.addEventListener("click", () => {
    const selectedValue = dotSelector.value
    if (selectedValue) {
      const index = Number.parseInt(selectedValue)
      // Remove the selected dot
      placedDotPositions.splice(index, 1)
      selectedDotIndex = null

      // Redistribute remaining dots
      redistributeDots()

      // Update UI
      updateDotManagementPanel()
    }
  })

  removeAllDotsButton.addEventListener("click", () => {
    // Remove all dots
    placedDotPositions.length = 0
    selectedDotIndex = null

    // Update UI
    drawCircle()
    updateDotManagementPanel()
  })

  // Set up event listener for action dropdown
  dotActionDropdown.addEventListener("change", () => {
    currentAction = dotActionDropdown.value

    // Update UI based on selected action
    if (currentAction === "remove") {
      dotSelector.style.display = "block"
      canvas.style.cursor = "not-allowed"
    } else {
      dotSelector.style.display = "none"
      canvas.style.cursor = "pointer"
    }

    // Redraw the canvas
    drawCircle()
  })

  // Initialize dot management panel
  updateDotManagementPanel()
}
