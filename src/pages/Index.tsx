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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/50"></div>

        {/* Geometric elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-600/8 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/6 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-700/7 rounded-full blur-3xl"></div>
        </div>

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.05) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <Header />

        <main>
          {/* Enhanced Hero Section */}
          <section className="relative py-20 md:py-28 lg:py-36">
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                      Connect with
                      <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {" "}
                        Retired Experts
                      </span>{" "}
                      for
                      <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        {" "}
                        Enterprise Growth
                      </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                      Peptok bridges the gap between your employees and seasoned
                      professionals, creating meaningful mentorship connections
                      that drive measurable business outcomes.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="text-lg px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <Link to="/signup">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 transition-all duration-200 hover:scale-105 hover:shadow-md border-blue-200 hover:border-blue-300"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <polygon points="5,3 19,12 5,21 5,3"></polygon>
                      </svg>
                      Watch Demo
                    </Button>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-3 gap-8 pt-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        500+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Expert Mentors
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        10k+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Connections Made
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        95%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Success Rate
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Visual */}
                <div className="relative">
                  <div className="relative z-10 bg-gradient-to-br from-blue-50/80 to-blue-100/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="space-y-6">
                      {/* Expert Cards Preview */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 transition-all duration-200 hover:scale-105">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
                            <div>
                              <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                              <div className="h-2 w-16 bg-gray-100 rounded mt-1"></div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="h-2 w-full bg-gray-100 rounded"></div>
                            <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                          </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 transition-all duration-200 hover:scale-105">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"></div>
                            <div>
                              <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                              <div className="h-2 w-16 bg-gray-100 rounded mt-1"></div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="h-2 w-full bg-gray-100 rounded"></div>
                            <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                      </div>

                      {/* Feature Icons */}
                      <div className="flex justify-center space-x-8 pt-4">
                        <div className="flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-110">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                            <svg
                              className="h-7 w-7 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            Expert Network
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-110">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                            <svg
                              className="h-7 w-7 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            Goal Tracking
                          </span>
                        </div>
                        <div className="flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-110">
                          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                            <svg
                              className="h-7 w-7 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            Success Metrics
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced background decorations */}
                  <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-600/20 blur-xl"></div>
                  <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500/15 to-blue-700/15 blur-xl"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <FeatureGrid />

          {/* Social Proof */}
          <section className="py-16 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-blue-600/5"></div>
            <div className="container relative">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Trusted by leading companies worldwide
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join hundreds of organizations already transforming their
                  workforce development
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                {[
                  "TechCorp",
                  "InnovateCo",
                  "GrowthTech",
                  "ScaleCorp",
                  "NextGen",
                  "FutureTech",
                ].map((company) => (
                  <div key={company} className="text-center">
                    <div className="h-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-md">
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
                  <Card
                    key={index}
                    className="relative backdrop-blur-sm bg-white/80 border-white/20 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
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
          <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 relative">
            <div className="absolute inset-0 bg-gradient-to-l from-blue-400/5 via-transparent to-blue-600/5"></div>
            <div className="container relative">
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
                    className={`relative backdrop-blur-sm bg-white/80 border-white/20 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center space-y-4">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div>
                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                          {plan.price}
                        </span>
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
                        className={`w-full transition-all duration-200 hover:scale-105 ${plan.popular ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800" : ""}`}
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
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    <Link to="/signup">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 transition-all duration-200 hover:scale-105 hover:shadow-md border-blue-200 hover:border-blue-300"
                  >
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
    </div>
  );
};

export default Index;
