"use client"

import { Button } from "@/components/ui/button"

interface QuickResponsesProps {
  responses: string[]
  onSelectResponse: (response: string) => void
}

export function QuickResponses({ responses, onSelectResponse }: QuickResponsesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {responses.map((response, index) => (
        <Button key={index} variant="outline" size="sm" onClick={() => onSelectResponse(response)}>
          {response}
        </Button>
      ))}
    </div>
  )
}
