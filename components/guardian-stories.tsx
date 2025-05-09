"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NoSignIcon } from "@/components/no-sign-icon"

const testimonials = [
  {
    id: "story1",
    name: "Sarah J.",
    role: "Recovered User",
    avatar: "SJ",
    content:
      "Narcoguard saved my life when I relapsed after 6 months of sobriety. The app detected my overdose and alerted my emergency contact who found me in time.",
  },
  {
    id: "story2",
    name: "Michael T.",
    role: "Parent",
    avatar: "MT",
    content:
      "After losing my daughter to an overdose, I became a Narcoguard volunteer. Last month, I was able to help save someone else's child because of the alert system.",
  },
  {
    id: "story3",
    name: "Dr. Lisa R.",
    role: "Emergency Physician",
    avatar: "LR",
    content:
      "As an ER doctor, I've seen the difference Narcoguard makes. Patients arrive sooner, with someone already administering naloxone. It's changing outcomes dramatically.",
  },
]

export function GuardianStories() {
  const [activeTab, setActiveTab] = useState("story1")

  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Background No Sign - Decorative */}
      <div className="absolute -left-20 -bottom-20 opacity-10 pointer-events-none">
        <NoSignIcon size={300} animated={false} strokeWidth={6} />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Guardian Stories</h2>
            <p className="text-muted-foreground">
              Real stories from people whose lives have been impacted by Narcoguard's life-saving technology and
              community support network.
            </p>
          </div>

          <div className="flex-shrink-0">
            <NoSignIcon size={120} strokeWidth={3} />
          </div>
        </div>

        <Tabs defaultValue="story1" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            {testimonials.map((testimonial) => (
              <TabsTrigger
                key={testimonial.id}
                value={testimonial.id}
                className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                {testimonial.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {testimonials.map((testimonial) => (
            <TabsContent key={testimonial.id} value={testimonial.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="glass-card border-primary/10">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <Avatar className="w-16 h-16 border-2 border-primary/20">
                        <AvatarImage src={`/placeholder.svg?height=64&width=64&text=${testimonial.avatar}`} />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <blockquote className="text-xl italic mb-4">"{testimonial.content}"</blockquote>
                        <div>
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
