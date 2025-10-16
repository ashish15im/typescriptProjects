import type { FormEntry } from "../components/types"
import { addTodoButton, closeTodoPopper, toggleTodoPopper } from "../components/todo-popper"

/**
 * Formats a date string to dd-Month-yyyy format
 * @param dateStr The date string in YYYY-MM-DD format
 * @returns Formatted date string in dd-Month-yyyy format
 */
function formatDateString(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return (
    date.getDate().toString().padStart(2, "0") +
    "-" +
    date.toLocaleString("en-US", { month: "short" }) +
    "-" +
    date.getFullYear()
  )
}

// Update the generateFormDataTableHTML function to use the new class names
export function generateFormDataTableHTML(): string {
  const savedData = localStorage.getItem("formEntries")
  if (!savedData) {
    return `
      <div class="form-entries-table-container" style="width: 100%; max-width: 800px; margin: 20px auto;">
        <h2 style="text-align: center; margin-bottom: 15px;">No Saved Data Found</h2>
        <p style="text-align: center;">Add entries using the form button and save them to see data here.</p>
      </div>
    `
  }

  const entries: FormEntry[] = JSON.parse(savedData)

  const html = `
    <div class="form-entries-container">
      <div class="form-entries-large-container form-entries-table-container">
        <h2 style="text-align: center; margin-bottom: 5px;">To Do List</h2>
        <div class="form-entries-wrapper">
          <div class="form-entries-component">
            <div class="form-entries-header">
              <div class="form-entries-row">
                <div class="form-entries-heading form-entries-header-col1 form-entries-col-1">Task</div>
                <div class="form-entries-heading form-entries-header-col2 form-entries-col-2">Completion Date</div>
                <div class="form-entries-heading form-entries-header-col3 form-entries-col-3">Vehicles</div>
                <div class="form-entries-heading form-entries-header-col4 form-entries-col-4">Gender</div>
                <div class="form-entries-heading form-entries-header-col5 form-entries-col-5">Timestamp</div>
                <div class="form-entries-heading form-entries-header-col5 form-entries-col-5">Actions</div>
              </div>
            </div>
            <div class="form-entries-scroll">
              <div class="form-entries-body">
                ${entries
                  .map((entry) => {
                    const date = new Date(entry.timestamp)
                    const formattedDate =
                      date.getDate().toString().padStart(2, "0") +
                      "-" +
                      date.toLocaleString("en-US", { month: "short" }) +
                      "-" +
                      date.getFullYear()
                    const formattedTime = date
                      .toTimeString()
                      .slice(0, 5) // "HH:MM"

                    return `
                    <div class="form-entries-row">
                      <div class="form-entries-cell form-entries-col-1">${entry.name || "Not provided"}</div>
                      <div class="form-entries-cell form-entries-col-2">${formatDateString(entry.completionDate) || "Not set"}</div>
                      <div class="form-entries-cell form-entries-col-3">${entry.vehicles.length > 0 ? entry.vehicles.join(", ") : "None selected"}</div>
                      <div class="form-entries-cell form-entries-col-4">${entry.gender || "Not specified"}</div>
                      <div class="form-entries-cell form-entries-col-5">${formattedDate}<br>
                      <span style="display: inline-block; margin-left: 25px;">${formattedTime}</span>
                                  </div>
                      <div class="form-entries-cell form-entries-col-5">
                        <div style="display: flex; gap: 5px; justify-content: center;">
                          <button class="btn edit-btn" data-id="${entry.id}" style="background-color: #4682b4; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Edit</button>
                          <button class="btn delete-btn" data-id="${entry.id}" style="background-color: #ff5252; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Delete</button>
                        </div>
                      </div>
                    </div>
                  `
                  })
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  // Return the HTML first
  return html
}

/**
 * Attaches event listeners to the edit and delete buttons in the table
 */
export function attachActionButtonListeners(): void {
  // Add event listeners for edit and delete buttons
  const editButtons = document.querySelectorAll(".edit-btn")
  const deleteButtons = document.querySelectorAll(".delete-btn")

  editButtons.forEach((button) => {
    button.addEventListener("click", handleEditEntry)
  })

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDeleteEntry)
  })
}

/**
 * Handles the deletion of a form entry
 * @param event The click event
 */
export function handleDeleteEntry(event: Event): void {
  const button = event.target as HTMLButtonElement
  const entryId = Number.parseInt(button.getAttribute("data-id") || "0")

  if (confirm("Are you sure you want to delete this entry?")) {
    // Get existing entries
    const existingEntriesJson = localStorage.getItem("formEntries")
    if (!existingEntriesJson) return

    const entries: FormEntry[] = JSON.parse(existingEntriesJson)

    // Filter out the entry to delete
    const updatedEntries = entries.filter((entry) => entry.id !== entryId)

    // Save updated entries
    localStorage.setItem("formEntries", JSON.stringify(updatedEntries))

    // Update the table
    const mainContent = document.querySelector<HTMLElement>(".main-content")
    if (mainContent) {
      mainContent.innerHTML = generateFormDataTableHTML()
      // Re-attach event listeners for the new buttons
      attachActionButtonListeners()
      // Re-add the todo button
      addTodoButton()
    }
  }
}

/**
 * Handles editing a form entry
 * @param event The click event
 */
export function handleEditEntry(event: Event): void {
  const button = event.target as HTMLButtonElement
  const entryId = Number.parseInt(button.getAttribute("data-id") || "0")

  // Get existing entries
  const existingEntriesJson = localStorage.getItem("formEntries")
  if (!existingEntriesJson) return

  const entries: FormEntry[] = JSON.parse(existingEntriesJson)

  // Find the entry to edit
  const entryToEdit = entries.find((entry) => entry.id === entryId)
  if (!entryToEdit) return

  // Open the todo popper
  addTodoButton()
  toggleTodoPopper()

  // Fill the form with the entry data
  const nameInput = document.querySelector<HTMLInputElement>(".name-input")
  const completionDateInput = document.querySelector<HTMLInputElement>(".completion-date")
  const vehicleCheckboxes = document.querySelectorAll<HTMLInputElement>(".vehicle-checkbox")
  const genderRadios = document.querySelectorAll<HTMLInputElement>(".gender-radio")

  if (nameInput) nameInput.value = entryToEdit.name
  if (completionDateInput) completionDateInput.value = entryToEdit.completionDate

  // Check the appropriate vehicle checkboxes
  vehicleCheckboxes.forEach((checkbox) => {
    checkbox.checked = entryToEdit.vehicles.includes(checkbox.value)
  })

  // Select the appropriate gender radio
  genderRadios.forEach((radio) => {
    radio.checked = radio.value === entryToEdit.gender
  })

  // Get references to the save and cancel buttons
  const saveBtn = document.querySelector<HTMLButtonElement>(".save-btn")
  const cancelBtn = document.querySelector<HTMLButtonElement>(".cancel-btn")

  if (saveBtn) {
    // Remove existing event listeners
    const newSaveBtn = saveBtn.cloneNode(true) as HTMLButtonElement
    saveBtn.parentNode?.replaceChild(newSaveBtn, saveBtn)

    // Add new event listener for updating
    newSaveBtn.addEventListener("click", () => {
      // Get form values
      const name = nameInput ? nameInput.value.trim() : ""
      const completionDate = completionDateInput ? completionDateInput.value : ""

      // Get selected vehicles
      const vehicleOptions = document.querySelectorAll<HTMLInputElement>('input[name="vehicle"]:checked')
      const selectedVehicles = Array.from(vehicleOptions).map((option) => option.value)

      // Get selected gender
      const genderOption = document.querySelector<HTMLInputElement>('input[name="gender"]:checked')
      const selectedGender = genderOption ? genderOption.value : null

      // Find the entry index
      const entryIndex = entries.findIndex((entry) => entry.id === entryId)

      if (entryIndex !== -1) {
        // Update the entry
        entries[entryIndex] = {
          ...entries[entryIndex],
          name,
          completionDate,
          vehicles: selectedVehicles,
          gender: selectedGender,
        }

        // Save to local storage
        localStorage.setItem("formEntries", JSON.stringify(entries))

        // Update the table
        const mainContent = document.querySelector<HTMLElement>(".main-content")
        if (mainContent) {
          mainContent.innerHTML = generateFormDataTableHTML()
          // Re-attach event listeners
          attachActionButtonListeners()
          // Re-add the todo button
          addTodoButton()
        }

        // Close the form
        closeTodoPopper()
      }
    })
  }

  // Update cancel button to just close the popper
  if (cancelBtn) {
    // Remove existing event listeners
    const newCancelBtn = cancelBtn.cloneNode(true) as HTMLButtonElement
    cancelBtn.parentNode?.replaceChild(newCancelBtn, cancelBtn)

    // Add new event listener
    newCancelBtn.addEventListener("click", () => {
      closeTodoPopper()
    })
  }
}

// Generate Todo HTML
export function generateTodoHTML(): string {
  return generateFormDataTableHTML()
}

/**
 * Attaches event listeners for todo functionality
 */
export function attachTodoListeners(): void {
  // Attach event listeners to the edit and delete buttons
  attachActionButtonListeners()
  console.log("Todo listeners attached")
}
