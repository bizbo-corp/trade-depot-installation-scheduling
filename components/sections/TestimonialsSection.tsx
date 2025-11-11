"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { peoplePortraits } from "@/lib/images"

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
      avatar: peoplePortraits.ireneChapple.path,
      initials: "IC"
    },
    {
      quote: "Michael guided through a process to 'productise' our service business. The idea is to take what we do organically to be more deliberate and predictive. It was excellent. He listens and interprets. He has a suite of design tools that extract the essence of what we imagined and suggest a path forward. And all good fun along the way. Great guy. Good process. Thanks!",
      author: "Vincent Heeringa",
      role: "Founder",
      company: "Better Aotearoa",
      avatar: peoplePortraits.vincentHeeringa.path,
      initials: "VH"
    }
  ],
  heading = "What they say",
  subheading = "Customer love",
  showStars = true
}: TestimonialsSectionProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!carouselApi || testimonials.length < 2 || isHovered) return

    const autoplay = setInterval(() => {
      if (!carouselApi) return

      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext()
      } else {
        carouselApi.scrollTo(0)
      }
    }, 8000)

    return () => clearInterval(autoplay)
  }, [carouselApi, testimonials.length, isHovered])

  return (
    <section className="bg-background/80 py-12 md:py-24">
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
        <Carousel
          className="w-full max-w-4xl"
          opts={{ loop: testimonials.length > 1 }}
          setApi={setCarouselApi}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <div className="flex flex-col items-center gap-8 text-center">
                  <blockquote className="max-w-2xl text-lg md:text-xl">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    <Avatar className="h-16 w-16">
                      {testimonial.avatar && (
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <AvatarFallback className="text-lg md:text-xl">
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

