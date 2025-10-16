import type { FormEntry } from "../components/types"

/**
 * Generates HTML for Todo Popper
 */
export function generateTodoPopperHTML(): string {
  return `
      <div class="todo-popper">
          <div class="todo-popper-header">
              <h3>Form Entry</h3>
              <button class="close-todo-popper-btn">×</button>
          </div>
          <div class="todo-popper-content">
              <div class="form-group">
                  <label for="name">Name:</label>
                  <input type="text" class="name-input" name="name" placeholder="Enter your name">
              </div>
              
              <div class="form-group">
                  <label for="completionDate">Completion Date:</label>
                  <input type="date" class="completion-date" name="completionDate">
              </div>
              
              <div class="form-group">
                  <label>Vehicle:</label>
                  <div class="checkbox-group">
                      <div class="checkbox-option">
                          <input type="checkbox" class="vehicle-checkbox" name="vehicle" value="car">
                          <label for="vehicleCar">Car</label>
                      </div>
                      <div class="checkbox-option">
                          <input type="checkbox" class="vehicle-checkbox" name="vehicle" value="bike">
                          <label for="vehicleBike">Bike</label>
                      </div>
                      <div class="checkbox-option">
                          <input type="checkbox" class="vehicle-checkbox" name="vehicle" value="cycle">
                          <label for="vehicleCycle">Cycle</label>
                      </div>
                  </div>
              </div>
              
              <div class="form-group">
                  <label>Gender:</label>
                  <div class="radio-group">
                      <div class="radio-option">
                          <input type="radio" class="gender-radio" name="gender" value="male">
                          <label for="genderMale">Male</label>
                      </div>
                      <div class="radio-option">
                          <input type="radio" class="gender-radio" name="gender" value="female">
                          <label for="genderFemale">Female</label>
                      </div>
                  </div>
              </div>
              
              <div class="form-actions">
                  <button class="cancel-btn">Cancel</button>
                  <button class="save-btn">Save</button>
              </div>
          </div>
      </div>
    `
}

/**
 * Adds Todo Button to the main content
 */
export function addTodoButton(): void {
  // Create the button element if it doesn't exist
  if (!document.querySelector(".show-todo-popper-btn")) {
    const todoButton = document.createElement("button")
    todoButton.className = "show-todo-popper-btn"
    todoButton.innerHTML = "✓"
    todoButton.title = "Add Entry"

    // Create the popper container
    const popperContainer = document.createElement("div")
    popperContainer.className = "todo-popper-container"
    popperContainer.style.display = "none"
    popperContainer.innerHTML = generateTodoPopperHTML()

    // Add button and popper to the main content
    document.body.appendChild(todoButton)
    document.body.appendChild(popperContainer)

    // Add event listener to the button
    todoButton.addEventListener("click", toggleTodoPopper)

    // Add event listener to close button
    const closeBtn = popperContainer.querySelector<HTMLButtonElement>(".close-todo-popper-btn")
    if (closeBtn) {
      closeBtn.addEventListener("click", closeTodoPopper)
    }

    // Add event listeners for form functionality in the popper
    attachTodoPopperListeners()
  }
}

/**
 * Removes the Todo Button and popper container from the DOM
 */
export function removeTodoButton(): void {
  const todoButton = document.querySelector(".show-todo-popper-btn")
  const popperContainer = document.querySelector(".todo-popper-container")

  if (todoButton) {
    todoButton.remove()
  }

  if (popperContainer) {
    popperContainer.remove()
  }
}

/**
 * Toggles the visibility of Todo Popper
 */
export function toggleTodoPopper(): void {
  const popperContainer = document.querySelector(".todo-popper-container")
  // Check if the popper container exists
  if (popperContainer) {
    // Check if the popper is currently hidden (display is "none")
    if ((popperContainer as HTMLElement).style.display === "none") {
      // Show the popper (set display to "block")
      ;(popperContainer as HTMLElement).style.display = "block"
      // Set default date to today
      const dateInput = document.querySelector(".completion-date") as HTMLInputElement
      if (dateInput) {
        const today = new Date()
        const formattedDate = today.toISOString().split("T")[0] // Get the date in YYYY-MM-DD format
        dateInput.value = formattedDate // Set the date input field to today's date
      }
    } else {
      ;(popperContainer as HTMLElement).style.display = "none"
    }
  }
}

/**
 * Closes Todo Popper
 */
export function closeTodoPopper(): void {
  const popperContainer = document.querySelector(".todo-popper-container")
  if (popperContainer) {
    ;(popperContainer as HTMLElement).style.display = "none"
  }
}

/**
 * Attaches event listeners for form functionality in the popper
 */
export function attachTodoPopperListeners(): void {
  const nameInput = document.querySelector<HTMLInputElement>(".name-input")
  const saveBtn = document.querySelector<HTMLButtonElement>(".save-btn")
  const cancelBtn = document.querySelector<HTMLButtonElement>(".cancel-btn")

  if (!nameInput || !saveBtn) return

  // Remove any existing event listeners
  const newSaveBtn = saveBtn.cloneNode(true) as HTMLButtonElement
  saveBtn.parentNode?.replaceChild(newSaveBtn, saveBtn)

  // Save button click for new entries
  newSaveBtn.addEventListener("click", () => {
    // Get form values
    const name = nameInput.value.trim()

    const completionDateInput = document.querySelector<HTMLInputElement>(".completion-date")
    const completionDate = completionDateInput ? completionDateInput.value : ""

    // Get selected vehicles
    const vehicleOptions = document.querySelectorAll<HTMLInputElement>('input[name="vehicle"]:checked')
    const selectedVehicles = Array.from(vehicleOptions).map((option) => option.value)

    // Get selected gender
    const genderOption = document.querySelector<HTMLInputElement>('input[name="gender"]:checked')
    const selectedGender = genderOption ? genderOption.value : null

    // Create form entry object
    const newEntry: FormEntry = {
      id: Date.now(),
      name,
      completionDate,
      vehicles: selectedVehicles,
      gender: selectedGender,
      timestamp: Date.now(),
    }

    // Get existing entries or initialize empty array
    const existingEntriesJson = localStorage.getItem("formEntries")
    const entries: FormEntry[] = existingEntriesJson ? JSON.parse(existingEntriesJson) : []

    // Add new entry
    entries.push(newEntry)

    // Save to local storage
    localStorage.setItem("formEntries", JSON.stringify(entries))
    console.log("Added new entry:", newEntry)

    // Update the main content if we're on the todo page
    const mainContent = document.querySelector<HTMLElement>(".main-content")
    if (mainContent && mainContent.innerHTML.includes("To Do List")) {
      // Import dynamically to avoid circular dependencies
      import("./todo-list").then((todoList) => {
        if (mainContent) {
          mainContent.innerHTML = todoList.generateFormDataTableHTML()
          // Re-attach event listeners
          todoList.attachActionButtonListeners()
          // Re-add the todo button
          addTodoButton()
        }
      })
    }

    // Reset form
    nameInput.value = ""

    // Close the form
    closeTodoPopper()
  })

  // Cancel button click
  if (cancelBtn) {
    // Remove any existing event listeners
    const newCancelBtn = cancelBtn.cloneNode(true) as HTMLButtonElement
    cancelBtn.parentNode?.replaceChild(newCancelBtn, cancelBtn)

    newCancelBtn.addEventListener("click", () => {
      closeTodoPopper()
    })
  }
}
