"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  examCleared: string;
  examType: string;
  quote: string;
  rating: number;
  rank?: string;
  year: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "",
    initials: "PS",
    examCleared: "ICAR JRF",
    examType: "Agronomy",
    quote:
      "AgriVerse Academy transformed my preparation journey. The structured study material and mock tests were exactly what I needed to crack JRF in my first attempt!",
    rating: 5,
    rank: "AIR 23",
    year: "2024",
  },
  {
    id: "2",
    name: "Rahul Kumar",
    avatar: "",
    initials: "RK",
    examCleared: "AIEEA-UG",
    examType: "Agriculture",
    quote:
      "The PYQs collection and video lectures helped me understand complex concepts easily. I secured admission to my dream college thanks to AgriVerse!",
    rating: 5,
    rank: "AIR 156",
    year: "2024",
  },
  {
    id: "3",
    name: "Ananya Patel",
    avatar: "",
    initials: "AP",
    examCleared: "ICAR JRF",
    examType: "Biotechnology",
    quote:
      "The community discussions and doubt-solving sessions were invaluable. Faculty notes are comprehensive and exam-focused. Highly recommended!",
    rating: 5,
    rank: "AIR 45",
    year: "2023",
  },
  {
    id: "4",
    name: "Vikram Singh",
    avatar: "",
    initials: "VS",
    examCleared: "CSIR NET",
    examType: "Life Sciences",
    quote:
      "I tried many platforms but AgriVerse stands out for its quality content and user-friendly interface. The test series is top-notch!",
    rating: 5,
    rank: "Qualified",
    year: "2024",
  },
  {
    id: "5",
    name: "Sneha Reddy",
    avatar: "",
    initials: "SR",
    examCleared: "GATE BT",
    examType: "Biotechnology",
    quote:
      "The subject-wise question banks and detailed solutions helped me identify my weak areas. I improved significantly in just 3 months!",
    rating: 5,
    rank: "Score: 78/100",
    year: "2024",
  },
  {
    id: "6",
    name: "Arjun Mehta",
    avatar: "",
    initials: "AM",
    examCleared: "CUET PG",
    examType: "Horticulture",
    quote:
      "Best investment for ICAR preparation! The mobile-friendly platform allowed me to study anywhere. Cleared CUET PG with flying colors.",
    rating: 5,
    rank: "Top 1%",
    year: "2024",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => {
      if (newDirection === 1) {
        return prev === testimonials.length - 1 ? 0 : prev + 1;
      }
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  // Show 3 cards on desktop, 1 on mobile
  const visibleTestimonials =
    typeof window !== "undefined" && window.innerWidth >= 1024
      ? [
          testimonials[activeIndex],
          testimonials[(activeIndex + 1) % testimonials.length],
          testimonials[(activeIndex + 2) % testimonials.length],
        ]
      : [testimonials[activeIndex]];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-agri-lime/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Student Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            What Our{" "}
            <span className="gradient-text">Students Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful students who achieved their dreams with
            AgriVerse Academy.
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <StarRating rating={5} />
              <span className="font-semibold">4.9/5</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">
              Based on 10,000+ reviews
            </span>
          </div>
        </motion.div>

        {/* Testimonials Grid - Desktop */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-10">
          {[0, 1, 2].map((offset) => {
            const testimonial = testimonials[
              (activeIndex + offset) % testimonials.length
            ];
            return (
              <motion.div
                key={`${testimonial.id}-${offset}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: offset * 0.1 }}
              >
                <Card className="relative overflow-hidden card-hover border-border/50 bg-card/80 backdrop-blur-sm h-full">
                  {/* Quote mark */}
                  <div className="absolute -top-4 -right-4 text-8xl text-primary/10 font-serif leading-none">
                    &ldquo;
                  </div>

                  <CardContent className="p-6 pt-8">
                    {/* Rating */}
                    <StarRating rating={testimonial.rating} />

                    {/* Quote */}
                    <p className="mt-4 text-muted-foreground leading-relaxed line-clamp-4">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                      <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Cleared {testimonial.examCleared}
                          {testimonial.rank && ` • ${testimonial.rank}`}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {testimonial.year}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden mb-10 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{
                opacity: 0,
                x: direction > 0 ? 100 : -100,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -100 : 100,
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                <div className="absolute -top-4 -right-4 text-8xl text-primary/10 font-serif leading-none">
                  &ldquo;
                </div>

                <CardContent className="p-6 pt-8">
                  <StarRating rating={testimonials[activeIndex].rating} />

                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    &ldquo;{testimonials[activeIndex].quote}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage
                        src={testimonials[activeIndex].avatar}
                        alt={testimonials[activeIndex].name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonials[activeIndex].initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">
                        {testimonials[activeIndex].name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Cleared {testimonials[activeIndex].examCleared}
                        {testimonials[activeIndex].rank &&
                          ` • ${testimonials[activeIndex].rank}`}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {testimonials[activeIndex].year}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full shadow-md bg-card z-10"
            onClick={() => paginate(-1)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 rounded-full shadow-md bg-card z-10"
            onClick={() => paginate(1)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-8 bg-primary"
                  : "bg-primary/30 hover:bg-primary/50"
              )}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="hidden lg:flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => paginate(-1)}
            className="rounded-xl px-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => paginate(1)}
            className="rounded-xl px-6"
          >
            Next
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
