import { images } from "../../images/index"
import "./carousel.css"
import { generateRegistrationHTML, attachRegistrationFormListeners } from "../registration"

export function carousel(): string {
  return `
   <div class="carousel-container" id="carouselContainer">
            <div class="carousel-slide" id="carouselSlide">
                <img src="${images.img1}" alt="Image 1" />
                <img src="${images.img2}" alt="Image 2" />
                <div class="registration-slide">
                    ${generateRegistrationHTML()}
                </div>
            </div>
            <div class="carousel-nav">
                <button id="carouselPrev" class="carousel-btn">‹</button>
                <button id="carouselNext" class="carousel-btn">›</button>
            </div>
        </div> 
    `
}

export function carouselListeners(): void {
  let currentIndex = 0
  const totalSlides = 3 // Now we have 3 slides
  const carouselSlide = document.querySelector("#carouselSlide") as HTMLElement
  const carouselContainer = document.querySelector("#carouselContainer") as HTMLElement
  
  carouselContainer.addEventListener("mouseenter", () => {
    if (slideTimer !== null) {
      clearInterval(slideTimer)
      slideTimer = null
    }
  })
  
  carouselContainer.addEventListener("mouseleave", () => {
    // Only restart timer if not on the registration slide
    if (!carouselContainer.classList.contains("registration-slide-active")) {
      resetTimer()
    }
  })
  
  
  const prevBtn = document.querySelector("#carouselPrev")
  const nextBtn = document.querySelector("#carouselNext")
  let slideTimer: number | null = null

  // Custom event for slide changes
  const slideChangedEvent = new Event("slideChanged")

  function updateSlide() {
    // Remove registration-active class first
    carouselContainer.classList.remove("registration-slide-active")
    
    if (currentIndex === 0) {
      carouselSlide.innerHTML = `<img src="${images.img1}" alt="Image 1">`
    } else if (currentIndex === 1) {
      carouselSlide.innerHTML = `<div class="registration-slide">${generateRegistrationHTML()}</div>`
      // Add class to indicate we are on registration slide
      carouselContainer.classList.add("registration-slide-active")
      // Attach event listeners to the registration form
      attachRegistrationFormListeners()


      
    } else {
      carouselSlide.innerHTML = `<img src="${images.img2}" alt="Image 2">`
    }

    // Dispatch event that slide has changed
    document.dispatchEvent(slideChangedEvent)

    // Reset the timer whenever slide changes
    resetTimer()
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % totalSlides
    updateSlide()
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
    updateSlide()
  }

  function resetTimer() {
    // Clear existing timer if any
    if (slideTimer) {
      clearInterval(slideTimer)
    }

    // Set new timer - 10 seconds (10000 milliseconds)
    slideTimer = window.setInterval(() => {
      nextImage()
    }, 10000)
  }

  // Attach listeners
  nextBtn?.addEventListener("click", () => {
    nextImage()
    // Reset timer when manually navigating
    resetTimer()
  })

  prevBtn?.addEventListener("click", () => {
    prevImage()
    // Reset timer when manually navigating
    resetTimer()
  })

  // Initialize
  updateSlide()

  // Start the initial timer
  resetTimer()
}