"use client"

import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar?: string
  initials?: string
}

export interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
  heading?: string
  subheading?: string
  showStars?: boolean
}

export const TestimonialsSection = ({
  testimonials = [
    {
      quote: "Michael ran a Design Thinking Workshop with us after we approached him with some ideas on how we could better lean into AI tools to improve our processes and outputs. He drive the process extremely effectively, ensuring we gathered information from our clients to lay the groundwork, before running an in-person workshop. He was organised, creative, thoughtful and insightful. We are grateful for the talents, knowledge and skills he brought to the table and would recommend him to any future client.",
      author: "Irene Chapple",
      role: "Founder",
      company: "Better Aotearoa",
      avatar: "https://github.com/shadcn.png",
      initials: "IC"
    }
  ],
  heading = "Customer love",
  subheading = "Testimonial section",
  showStars = true
}: TestimonialsSectionProps) => {
  return (
    <section className="bg-muted py-12 md:py-24">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">{subheading}</p>
          <h2 className="text-3xl font-bold">{heading}</h2>
        </div>
        {showStars && (
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-muted-foreground/30 fill-muted-foreground" />
            ))}
          </div>
        )}
        <Carousel className="w-full max-w-4xl">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center gap-8 text-center">
                  <blockquote className="max-w-2xl text-lg md:text-xl">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    <Avatar>
                      {testimonial.avatar && (
                        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      )}
                      <AvatarFallback>
                        {testimonial.initials || testimonial.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                        {testimonial.company && `, ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

