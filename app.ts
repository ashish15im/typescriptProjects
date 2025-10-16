import { generateTablesHTML as generateTablesHTMLImport } from "./components/tables"
import {
  generateRegistrationHTML as generateRegistrationHTMLImport,
  attachRegistrationFormListeners as attachRegistrationFormListenersImport,
} from "./components/registration"
import {
  generateTodoHTML as generateTodoHTMLImport,
  attachActionButtonListeners,
  attachTodoListeners as attachTodoListenersImport,
} from "./components/todo-list"
import { addTodoButton, removeTodoButton } from "./components/todo-popper"
import {
  generateManageAttachmentHTML as generateManageAttachmentHTMLImport,
  attachAttachmentManagerListeners as attachAttachmentManagerListenersImport,
} from "./components/manage-attachment"
import {
  carousel as carouselHTMLImport,
  carouselListeners as carouselListenersImport,
} from "./components/carousel/carousel"
import {
  canvas as canvasHTMLIMport,
  canvasListeners,
  canvasListeners as canvasListenersImport,
} from "./components/canvas/circle"

import {
  circle ,
  circleListeners ,
} from "./components/circle/canvas"

// Interface definitions
interface FormEntry {
  id: number
  name: string
  completionDate: string
  vehicles: string[]
  gender: string | null
  timestamp: number
}

// Function type definitions
type ContentGeneratorFunction = () => string
type EventListenerAttachFunction = () => void

// Declare the module-level variables with types
let generateTablesHTML: ContentGeneratorFunction
let generateRegistrationHTML: ContentGeneratorFunction
let attachRegistrationFormListeners: EventListenerAttachFunction
let generateTodoHTML: ContentGeneratorFunction
let attachTodoListeners: EventListenerAttachFunction
let generateManageAttachmentHTML: ContentGeneratorFunction
let attachAttachmentManagerListeners: EventListenerAttachFunction
let carousel:ContentGeneratorFunction;
let carouselListeners:EventListenerAttachFunction
let canvas:ContentGeneratorFunction;

// Override the module-level variables with the imported functions
generateTablesHTML = generateTablesHTMLImport
generateRegistrationHTML = generateRegistrationHTMLImport
attachRegistrationFormListeners = attachRegistrationFormListenersImport
generateTodoHTML = generateTodoHTMLImport
generateManageAttachmentHTML = generateManageAttachmentHTMLImport
attachAttachmentManagerListeners = attachAttachmentManagerListenersImport
attachTodoListeners = attachTodoListenersImport
carousel=carouselHTMLImport
carouselListeners=carouselListenersImport
canvas=canvasHTMLIMport
/**
 * Shows content based on navigation item selection
 * @param type The type of content to show
 */
function showContent(type: string): void {
  const mainContent = document.querySelector<HTMLElement>(".main-content")

  if (!mainContent) return

  // Remove the todo button if it exists
  removeTodoButton()

  // Update the active navigation item
  updateActiveNavItem(type)

  if (type === "tables") {
    mainContent.innerHTML = generateTablesHTML()
  } else if (type === "registration") {
    mainContent.innerHTML = generateRegistrationHTML()
    // Re-attach event listeners after changing content
    attachRegistrationFormListeners()
  } else if (type === "todo") {
    mainContent.innerHTML = generateTodoHTML()
    // Attach event listeners for todo functionality
    attachActionButtonListeners()
    // Only add the todo button on the Todo page
    addTodoButton()
  } else if (type === "manageAttachment") {
    mainContent.innerHTML = generateManageAttachmentHTML()
    // Attach event listeners for attachment manager functionality
    attachAttachmentManagerListeners()
  }
  else if (type === "carousel") {
    mainContent.innerHTML = carousel()
    // Attach event listeners for attachment manager functionality
    carouselListeners()
  }
  else if (type=="canvas"){
    mainContent.innerHTML=canvas()    
    canvasListeners()
  }
  else if (type=="circle"){
    mainContent.innerHTML=circle()    
    circleListeners()
  }
  // Update the URL hash to reflect the current page
  window.location.hash = `#${type}`
}

/**
 * Updates the active navigation item by adding the 'active' class
 * @param type The type of content currently active
 */
function updateActiveNavItem(type: string): void {
  // Remove active class from all nav items
  const navItems = document.querySelectorAll<HTMLAnchorElement>(".side-nav-item")
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  // Add active class to the current nav item
  const activeNavItem = document.querySelector<HTMLAnchorElement>(`.side-nav-item[href="#${type}"]`)
  if (activeNavItem) {
    activeNavItem.classList.add("active")
    activeNavItem.style.transition="background-color 0.3s ease"
  }
}
// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners to navigation items
  const navItems = document.querySelectorAll<HTMLAnchorElement>(".side-nav-item")
  navItems.forEach((item) => {
    const contentType = item.getAttribute("href")?.substring(1)
    if (contentType) {
      item.addEventListener("click", (e) => {
        e.preventDefault()
        showContent(contentType)
      })
    }
  })

  const hash = window.location.hash.substring(1)
  if (hash) {
    showContent(hash)
  } else {
    // If no hash, highlight the first nav item by default
    const firstNavItem = document.querySelector<HTMLAnchorElement>(".side-nav-item")
    if (firstNavItem) {
      const contentType = firstNavItem.getAttribute("href")?.substring(1)
      if (contentType) {
        showContent(contentType)
      }
    }
  }
})

// Make showContent available globally
;(window as any).showContent = showContent
