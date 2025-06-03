import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LandingHero from "@/components/hero/LandingHero";
import FeatureGrid from "@/components/features/FeatureGrid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const testimonials = [
  {
    name: "Sarah Martinez",
    role: "VP of People Operations",
    company: "TechCorp",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b9d3cc57?w=400&h=400&fit=crop&crop=face",
    quote:
      "Peptok transformed our mentorship program. We saw a 40% increase in employee engagement and retention within 6 months.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Head of Learning & Development",
    company: "InnovateCo",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    quote:
      "The quality of experts and the matching system exceeded our expectations. Our employees are developing skills faster than ever.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Chief People Officer",
    company: "GrowthTech",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    quote:
      "The analytics dashboard gives us unprecedented insights into our workforce development ROI. Highly recommended.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "per employee/month",
    description: "Perfect for small teams getting started with mentorship",
    features: [
      "Up to 50 employees",
      "Basic expert matching",
      "Monthly progress reports",
      "Email support",
      "Core analytics",
    ],
  },
  {
    name: "Growth",
    price: "$99",
    period: "per employee/month",
    description: "Ideal for growing companies scaling their programs",
    features: [
      "Up to 250 employees",
      "Advanced AI matching",
      "Real-time analytics",
      "Priority support",
      "Custom goal templates",
      "Integration capabilities",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited employees",
      "Dedicated success manager",
      "Custom integrations",
      "Advanced security",
      "White-label options",
      "SLA guarantees",
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <LandingHero />

        {/* Features Section */}
        <FeatureGrid />

        {/* Social Proof */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Trusted by leading companies worldwide
              </h2>
              <p className="text-lg text-muted-foreground">
                Join hundreds of organizations already transforming their
                workforce development
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
              {[
                "TechCorp",
                "InnovateCo",
                "GrowthTech",
                "ScaleCorp",
                "NextGen",
                "FutureTech",
              ].map((company) => (
                <div key={company} className="text-center">
                  <div className="h-12 bg-muted rounded flex items-center justify-center">
                    <span className="font-semibold text-muted-foreground">
                      {company}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                What our customers say
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how organizations are achieving measurable results with
                Peptok
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                        <p className="text-sm text-primary font-medium">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ),
                      )}
                    </div>
                    <blockquote className="text-muted-foreground relative">
                      <Quote className="absolute -top-2 -left-2 h-4 w-4 text-primary/20" />
                      {testimonial.quote}
                    </blockquote>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that's right for your organization. All plans
                include our core features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative ${plan.popular ? "ring-2 ring-primary" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.period}
                      </span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to transform your workforce development?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join leading companies using Peptok to connect their employees
                with expert mentors and drive measurable business outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Schedule Demo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
