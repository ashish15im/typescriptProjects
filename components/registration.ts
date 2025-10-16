// Generate Registration HTML
export function generateRegistrationHTML(): string {
    return `
      <div class="registration-container">
          <div class="registration-form">
              <h2>Registration Form</h2>
              <form class="registration-form-element">
                  <div class="form-row">
                      <label for="name-field">Name:</label>
                      <input type="text" name="name" class="form-input name-input" id="name-field" required>
                  </div>
                  
                  <div class="form-row">
                      <label for="email-field">Email:</label>
                      <input type="email" name="email" class="form-input email-input" id="email-field" required>
                  </div>
                  
                  <div class="form-row">
                      <label>Gender:</label>
                      <input type="radio" name="gender" value="male" class="gender-input" id="gender-male" required>
                      <label for="gender-male">Male</label>
                      <input type="radio" name="gender" value="female" class="gender-input" id="gender-female" required>
                      <label for="gender-female">Female</label>
                  </div>
                  
                  <div class="form-row">
                      <label>Interests:</label>
                      <input type="checkbox" name="interests" value="coding" class="interest-input" id="interest-coding">
                      <label for="interest-coding">Coding</label>
                      <input type="checkbox" name="interests" value="music" class="interest-input" id="interest-music">
                      <label for="interest-music">Music</label>
                      <span class="interest-error" style="color: red; display: none;">Select at least one interest.</span>
                  </div>
                  
                  <div class="form-row">
                      <label for="country-field">Country:</label>
                      <select name="country" class="form-input country-select" id="country-field">
                          <option value="select">Select</option>
                          <option value="usa">USA</option>
                          <option value="canada">Canada</option>
                          <option value="uk">UK</option>
                      </select>
                  </div>
                  
                  <div class="form-row">
                      <label for="password-field">Password:</label>
                      <input type="password" name="password" class="form-input password-input" id="password-field" required>
                  </div>
                  
                  <div class="form-row">
                      <button type="submit" class="btn submit-btn" disabled>Submit</button>
                      <button type="reset" class="btn reset-btn">Reset</button>
                      <button type="button" class="btn cancel-btn" disabled>Cancel</button>
                  </div>
              </form>
          </div>
      </div>
      `
  }
  
  // Check form validity
  export function checkForm(): void {
    const form = document.querySelector<HTMLFormElement>(".registration-form-element")
    const submitButton = document.querySelector<HTMLButtonElement>(".submit-btn")
    const cancelButton = document.querySelector<HTMLButtonElement>(".cancel-btn")
    const countrySelect = document.querySelector<HTMLSelectElement>(".country-select")
    const interests = document.querySelectorAll<HTMLInputElement>('input[name="interests"]:checked')
  
    if (!form || !submitButton || !cancelButton || !countrySelect) return
  
    // Ensure at least one interest is selected and form is valid
    const isFormValid = form.checkValidity() && countrySelect.value !== "select" && interests.length > 0
  
    submitButton.disabled = !isFormValid
    cancelButton.disabled = !isFormValid
  }
  
  // Validate form on submit
  export function validateForm(event: Event): boolean {
    const interests = document.querySelectorAll<HTMLInputElement>('input[name="interests"]:checked')
    const errorSpan = document.querySelector<HTMLElement>(".interest-error")
  
    if (!errorSpan) return true
  
    if (interests.length === 0) {
      errorSpan.style.display = "inline"
      event.preventDefault()
      return false
    }
  
    errorSpan.style.display = "none"
    return true
  }
  
  // Attach event listeners to registration form
  export function attachRegistrationFormListeners(): void {
    const form = document.querySelector<HTMLFormElement>(".registration-form-element")
  
    if (form) {
      // Use inline functions to handle events
      form.addEventListener("input", () => checkForm())
      form.addEventListener("change", () => checkForm())
  
      // Fix the onchange handlers in the form
      const interestCheckboxes = form.querySelectorAll<HTMLInputElement>(".interest-input")
      interestCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => checkForm())
      })
  
      const countrySelect = form.querySelector<HTMLSelectElement>(".country-select")
      if (countrySelect) {
        countrySelect.addEventListener("change", () => checkForm())
      }
  
      // Fix the onsubmit handler
      form.addEventListener("submit", (event) => {
        if (!validateForm(event)) {
          event.preventDefault()
        }
      })
    }
  }
  