import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  initials: string;
  quote: string;
  rating: number;
  bgColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carla Mendes",
    role: "Gerente de RH",
    company: "",
    initials: "CM",
    quote:
      "O TalentPass revolucionou o treinamento da nossa equipe. Em 3 meses, vimos um aumento de 40% no engajamento.",
    rating: 5,
    bgColor: "from-indigo-500 to-purple-500",
  },
  {
    id: 2,
    name: "Rafael Santos",
    role: "Diretor de Pessoas",
    company: "",
    initials: "RS",
    quote: "Plataforma intuitiva e conteúdo de qualidade. Nossos colaboradores adoraram a experiência gamificada!",
    rating: 5,
    bgColor: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Juliana Oliveira",
    role: "Head de T&D",
    company: "",
    initials: "JO",
    quote:
      "Investimento que vale a pena. A facilidade de gestão e a qualidade dos cursos superaram nossas expectativas.",
    rating: 5,
    bgColor: "from-pink-500 to-rose-500",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold mb-4">
            💬 Depoimentos
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">O que dizem nossos clientes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Empresas que já transformaram suas equipes com o TalentPass
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-card hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in border-border"
            >
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className={`bg-gradient-to-br ${testimonial.bgColor} text-white font-semibold`}>
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name and Role */}
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>

                {/* Quote */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground italic">"{testimonial.quote}"</p>
                </div>

                {/* Rating */}
                <div className="flex justify-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2">
                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${testimonial.bgColor} text-white font-semibold`}
                          >
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Name and Role */}
                      <div className="text-center mb-4">
                        <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} • {testimonial.company}
                        </p>
                      </div>

                      {/* Quote */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground italic">"{testimonial.quote}"</p>
                      </div>

                      {/* Rating */}
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
