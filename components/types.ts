// Interface definitions
export interface FormEntry {
    id: number
    name: string
    completionDate: string
    vehicles: string[]
    gender: string | null
    timestamp: number
  }
  
  // Function type definitions
  export type ContentGeneratorFunction = () => string
  export type EventListenerAttachFunction = () => void
  