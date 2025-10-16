// Generate Manage Attachment HTML
export function generateManageAttachmentHTML(): string {
  // Define the combinations from the requirements
  const combinations = [
    { controller: "C1", motor: "M1", organization: "O1" },
    { controller: "C1", motor: "M1", organization: "O2" },
    { controller: "C1", motor: "M1", organization: "O3" },
    { controller: "C1", motor: "M2", organization: "O2" },
    { controller: "C1", motor: "M2", organization: "O3" },
    { controller: "C1", motor: "M3", organization: "O3" },
    { controller: "C2", motor: "M1", organization: "O1" },
    { controller: "C2", motor: "M1", organization: "O2" },
    { controller: "C2", motor: "M2", organization: "O1" },
    { controller: "C2", motor: "M3", organization: "O3" },
    { controller: "C3", motor: "M1", organization: "O2" },
    { controller: "C3", motor: "M3", organization: "O1" },
    { controller: "C3", motor: "M3", organization: "O3" },
    { controller: "C4", motor: "M1", organization: "O1" },
  ]

  // Get unique controllers
  const controllers = [...new Set(combinations.map((c) => c.controller))]

  // Generate the HTML for the selection interface
  return `
    <div class="attachment-container">
      <div class="attachment-wrapper">
        <h2 style="text-align: center; margin-bottom: 20px;">Controller-Motor-Organization Selection</h2>        
        <div class="selection-container">
          <div class="selection-row">
            <!-- Controller Column - Always visible with content -->
            <div class="selection-column" id="controller-column">
              <h3>Controllers</h3>
              <div class="selection-list" id="controller-list">
                ${controllers
                  .map(
                    (controller) => `
                  <div class="selection-item">
                    <input type="radio" id="controller-${controller}" name="controller" value="${controller}">
                    <label for="controller-${controller}">${controller}</label>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            </div>
            
            <!-- Motor Column - Visible but empty initially -->
            <div class="selection-column" id="motor-column">
              <h3>Motors</h3>
              <div class="selection-list" id="motor-list">
                <!-- Motors will be populated dynamically -->
              </div>
            </div>
            
            <!-- Organization Column - Visible but empty initially -->
            <div class="selection-column" id="organization-column">
              <h3>Organizations</h3>
              <div class="selection-list" id="organization-list">
                <!-- Organizations will be populated dynamically -->
              </div>
            </div>
          </div>
        </div>
        
        <div class="matrix-actions">
          <button class="btn reset-selection-btn">Reset</button>
        </div>
      </div>
    </div>
  `
}

/**
 * Initializes the attachment manager functionality
 */
export function initAttachmentManager(): void {
  // Define the combinations
  const combinations = [
    { controller: "C1", motor: "M1", organization: "O1" },
    { controller: "C1", motor: "M1", organization: "O2" },
    { controller: "C1", motor: "M1", organization: "O3" },
    { controller: "C1", motor: "M2", organization: "O2" },
    { controller: "C1", motor: "M2", organization: "O3" },
    { controller: "C1", motor: "M3", organization: "O3" },
    { controller: "C2", motor: "M1", organization: "O1" },
    { controller: "C2", motor: "M1", organization: "O2" },
    { controller: "C2", motor: "M2", organization: "O1" },
    { controller: "C2", motor: "M3", organization: "O3" },
    { controller: "C3", motor: "M1", organization: "O2" },
    { controller: "C3", motor: "M3", organization: "O1" },
    { controller: "C3", motor: "M3", organization: "O3" },
    { controller: "C4", motor: "M1", organization: "O1" },
  ]

  // Add event listeners to the reset button
  const resetBtn = document.querySelector<HTMLButtonElement>(".reset-selection-btn")
  if (resetBtn) {
    resetBtn.addEventListener("click", () => resetSelection(combinations))
  }

  // Add event listeners to controller radio buttons
  const controllerRadios = document.querySelectorAll<HTMLInputElement>('input[name="controller"]')
  controllerRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selectedController = radio.value
      populateMotorColumn(combinations, selectedController)

      // Clear organization column when controller changes
      const organizationList = document.getElementById("organization-list")
      if (organizationList) {
        organizationList.innerHTML = ""
      }

      updateResults(combinations)
    })
  })

  // Initial display of all combinations
  updateResults(combinations)
}

/**
 * Populates the motor column with motors associated with the selected controller
 */
function populateMotorColumn(
  combinations: Array<{ controller: string; motor: string; organization: string }>,
  selectedController: string,
): void {
  const motorList = document.getElementById("motor-list")
  if (!motorList) return

  // Filter motors based on selected controller
  const availableMotors = [
    ...new Set(combinations.filter((combo) => combo.controller === selectedController).map((combo) => combo.motor)),
  ]

  // Generate HTML for motor options
  const motorOptionsHTML = availableMotors
    .map(
      (motor) => `
    <div class="selection-item">
      <input type="radio" id="motor-${motor}" name="motor" value="${motor}">
      <label for="motor-${motor}">${motor}</label>
    </div>
  `,
    )
    .join("")

  // Update the motor list
  motorList.innerHTML = motorOptionsHTML

  // Add event listeners to the new motor radio buttons
  const motorRadios = document.querySelectorAll<HTMLInputElement>('input[name="motor"]')
  motorRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selectedMotor = radio.value
      populateOrganizationColumn(combinations, selectedController, selectedMotor)
      updateResults(combinations)
    })
  })
}

/**
 * Populates the organization column with organizations associated with the selected controller and motor
 */
function populateOrganizationColumn(
  combinations: Array<{ controller: string; motor: string; organization: string }>,
  selectedController: string,
  selectedMotor: string,
): void {
  const organizationList = document.getElementById("organization-list")
  if (!organizationList) return

  // Filter organizations based on selected controller and motor
  const availableOrganizations = [
    ...new Set(
      combinations
        .filter((combo) => combo.controller === selectedController && combo.motor === selectedMotor)
        .map((combo) => combo.organization),
    ),
  ]

  // Generate HTML for organization options
  const organizationOptionsHTML = availableOrganizations
    .map(
      (org) => `
    <div class="selection-item">
      <input type="radio" id="organization-${org}" name="organization" value="${org}">
      <label for="organization-${org}">${org}</label>
    </div>
  `,
    )
    .join("")

  // Update the organization list
  organizationList.innerHTML = organizationOptionsHTML

  // Add event listeners to the new organization radio buttons
  const organizationRadios = document.querySelectorAll<HTMLInputElement>('input[name="organization"]')
  organizationRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      updateResults(combinations)
    })
  })
}

/**
 * Updates the displayed results based on selected filters
 */
function updateResults(combinations: Array<{ controller: string; motor: string; organization: string }>): void {
  // Get selected values
  const selectedController = document.querySelector<HTMLInputElement>('input[name="controller"]:checked')?.value
  const selectedMotor = document.querySelector<HTMLInputElement>('input[name="motor"]:checked')?.value
  const selectedOrganization = document.querySelector<HTMLInputElement>('input[name="organization"]:checked')?.value

  // Filter combinations based on selections
  let filteredCombinations = [...combinations]

  // Apply controller filter
  if (selectedController) {
    filteredCombinations = filteredCombinations.filter((combo) => combo.controller === selectedController)
  }

  // Apply motor filter
  if (selectedMotor) {
    filteredCombinations = filteredCombinations.filter((combo) => combo.motor === selectedMotor)
  }

  // Apply organization filter
  if (selectedOrganization) {
    filteredCombinations = filteredCombinations.filter((combo) => combo.organization === selectedOrganization)
  }

  // Display the filtered results
  displayResults(filteredCombinations)
}

/**
 * Displays the filtered results in the results container
 */
function displayResults(combinations: Array<{ controller: string; motor: string; organization: string }>): void {
  const resultsBody = document.getElementById("results-body")
  if (!resultsBody) return

  if (combinations.length === 0) {
    resultsBody.innerHTML = `
      <div class="matrix-row">
        <div class="matrix-cell" colspan="3" style="text-align: center;">
          No matching combinations found
        </div>
      </div>
    `
    return
  }

  resultsBody.innerHTML = combinations
    .map(
      (combo) => `
    <div class="matrix-row">
      <div class="matrix-cell">${combo.controller}</div>
      <div class="matrix-cell">${combo.motor}</div>
      <div class="matrix-cell">${combo.organization}</div>
    </div>
  `,
    )
    .join("")
}

/**
 * Resets all selections and clears the motor and organization columns
 */
function resetSelection(combinations: Array<{ controller: string; motor: string; organization: string }>): void {
  // Uncheck all radio buttons
  const allRadios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked')
  allRadios.forEach((radio) => {
    radio.checked = false
  })

  // Clear motor and organization lists
  const motorList = document.getElementById("motor-list")
  const organizationList = document.getElementById("organization-list")

  if (motorList) {
    motorList.innerHTML = ""
  }

  if (organizationList) {
    organizationList.innerHTML = ""
  }

  // Show all combinations in the results
  updateResults(combinations)
}

/**
 * Attaches event listeners for attachment manager functionality
 */
export function attachAttachmentManagerListeners(): void {
  initAttachmentManager()
}
