import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Quote,
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  Shield,
  Search,
  BarChart3,
  BookOpen,
  Play,
  Zap,
  Award,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { SubscriptionTier } from "@/types";
import { BackendStatus } from "@/components/ui/BackendStatus";

const features = [
  {
    icon: Users,
    title: "Mentor Network",
    description:
      "Access to a curated network of retired industry mentors and leaders with proven track records.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Secure Communication",
    description:
      "Built-in messaging and video calling platform for seamless mentor-mentee interactions.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Comprehensive analytics to track engagement, progress, and ROI of mentorship programs.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description:
      "Access to curated learning materials and resources shared by expert mentors.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: TrendingUp,
    title: "Success Tracking",
    description:
      "Real-time tracking of key performance indicators and success metrics.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Enterprise-grade security with SSO integration and data protection compliance.",
    color: "from-gray-500 to-gray-600",
  },
];

const testimonials = [
  {
    name: "Sarah Martinez",
    role: "VP of People Operations",
    company: "JHSC",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b9d3cc57?w=400&h=400&fit=crop&crop=face",
    quote:
      "Peptok transformed our mentorship program. We saw a 40% increase in enterprise engagement and retention within 6 months.",
    rating: 5,
    impact: "+40% Engagement",
  },
  {
    name: "Michael Chen",
    role: "Head of Learning & Development",
    company: "InnovateCo",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    quote:
      "The quality of mentors and the matching system exceeded our expectations. Our enterprises are developing skills faster than ever.",
    rating: 5,
    impact: "+60% Skill Growth",
  },
  {
    name: "Emily Rodriguez",
    role: "Chief People Officer",
    company: "HarvardH2A",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    quote:
      "The analytics dashboard gives us unprecedented insights into our workforce development ROI. Highly recommended.",
    rating: 5,
    impact: "+200% ROI",
  },
];

// Pricing plans are now loaded from API, this is just for fallback
const fallbackPricingPlans = [
  {
    id: "starter",
    name: "Starter Plan",
    price: "CA$99",
    period: "per user/month",
    description: "Designed for small teams launching their mentorship journey",
    features: [
      "200 minutes of mentor time per month",
      "Minimum commitment: 2 users",
      "Monthly progress reports",
      "Email support",
      "Basic metrics dashboard",
    ],
    minimumUsers: 2,
    extraSeatPrice: "CA$119",
  },
  {
    id: "growth",
    name: "Growth Plan",
    price: "CA$199",
    period: "per user/month",
    description: "Ideal for expanding programs and scaling impact",
    features: [
      "1,200 minutes of mentor time per month",
      "Includes all Starter features",
      "Minimum commitment: 5 users",
      "Advanced metrics and analytics",
      "Priority support",
    ],
    minimumUsers: 5,
    extraSeatPrice: "CA$219",
    popular: true,
    badge: "Best Value",
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "Custom",
    period: "pricing",
    description: "Tailored for large organizations with complex requirements",
    features: [
      "Unlimited user seats",
      "Dedicated Customer Success Manager",
      "White-labeling and integration options",
      "SLA guarantees and priority SLAs",
    ],
    customPricing: true,
    badge: "Enterprise",
  },
];

const stats = [
  { value: "500+", label: "Coach Mentors", icon: Users },
  { value: "10k+", label: "Connections Made", icon: Target },
  { value: "95%", label: "Success Rate", icon: TrendingUp },
  { value: "50+", label: "Countries", icon: Globe },
];

const Index = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [pricingPlans, setPricingPlans] = useState<SubscriptionTier[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Load pricing plans from API
  useEffect(() => {
    const loadPricingPlans = async () => {
      try {
        setLoadingPlans(true);
        const plans = await api.getSubscriptionTiers();
        setPricingPlans(plans);
      } catch (error) {
        console.error("Failed to load pricing plans:", error);
        // Set empty array if API fails - component will show error state
        setPricingPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPricingPlans();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/50"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-1/4 left-0 w-64 h-64 bg-blue-600/8 rounded-full blur-2xl animate-bounce"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/6 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-72 h-72 bg-blue-700/7 rounded-full blur-3xl animate-bounce"
            style={{ animationDuration: "8s", animationDelay: "1s" }}
          ></div>
        </div>

        {/* Mesh Gradient Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.05) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        {/* Floating Particles */}
        <div
          className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-500/30 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-1/4 right-1/3 w-3 h-3 bg-blue-400/25 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-600/35 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-blue-300/20 rounded-full animate-bounce"
          style={{ animationDelay: "3s", animationDuration: "6s" }}
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
                <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                  <div className="space-y-6">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium bg-blue-50/80 text-blue-700 border-blue-200/50 backdrop-blur-sm">
                      <Zap className="mr-1 h-3 w-3" />
                      Trusted by 500+ companies worldwide
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                      Connect with
                      <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                        {" "}
                        Retired Experts
                      </span>{" "}
                      for
                      <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                        {" "}
                        Enterprise Growth
                      </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                      Peptok bridges the gap between your enterprises and
                      seasoned professionals, creating meaningful mentorship
                      connections that drive measurable business outcomes.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      size="lg"
                      className="text-lg px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                    >
                      <Link to="/signup">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg border-blue-200 hover:border-blue-300 group"
                    >
                      <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Watch Demo
                    </Button>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="text-center group">
                          <div className="flex flex-col items-center space-y-2">
                            <Icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                            <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                              {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {stat.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Visual */}
                <div className="relative animate-in slide-in-from-right duration-1000 delay-300">
                  <div className="relative z-10 bg-gradient-to-br from-blue-50/90 to-blue-100/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                    <div className="space-y-6">
                      {/* Expert Cards Preview */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
                            <div className="space-y-1">
                              <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                              <div
                                className="h-2 w-16 bg-gray-100 rounded animate-pulse"
                                style={{ animationDelay: "0.5s" }}
                              ></div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div
                              className="h-2 w-full bg-gray-100 rounded animate-pulse"
                              style={{ animationDelay: "1s" }}
                            ></div>
                            <div
                              className="h-2 w-3/4 bg-gray-100 rounded animate-pulse"
                              style={{ animationDelay: "1.5s" }}
                            ></div>
                          </div>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                          <div className="flex items-center space-x-3">
                            <div
                              className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 animate-pulse"
                              style={{ animationDelay: "0.3s" }}
                            ></div>
                            <div className="space-y-1">
                              <div
                                className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"
                                style={{ animationDelay: "0.8s" }}
                              ></div>
                              <div
                                className="h-2 w-16 bg-gray-100 rounded animate-pulse"
                                style={{ animationDelay: "1.3s" }}
                              ></div>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div
                              className="h-2 w-full bg-gray-100 rounded animate-pulse"
                              style={{ animationDelay: "1.8s" }}
                            ></div>
                            <div
                              className="h-2 w-3/4 bg-gray-100 rounded animate-pulse"
                              style={{ animationDelay: "2.3s" }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Feature Icons */}
                      <div className="flex justify-center space-x-8 pt-4">
                        {[
                          { icon: Users, label: "Mentor Network", delay: "0s" },
                          {
                            icon: Target,
                            label: "Goal Tracking",
                            delay: "0.5s",
                          },
                          {
                            icon: TrendingUp,
                            label: "Success Metrics",
                            delay: "1s",
                          },
                        ].map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={index}
                              className="flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-110 group"
                            >
                              <div
                                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 animate-bounce"
                                style={{
                                  animationDelay: item.delay,
                                  animationDuration: "2s",
                                }}
                              >
                                <Icon className="h-7 w-7 text-white" />
                              </div>
                              <span className="text-xs text-muted-foreground font-medium">
                                {item.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced background decorations */}
                  <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-r from-blue-400/20 to-blue-600/20 blur-xl animate-pulse"></div>
                  <div
                    className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500/15 to-blue-700/15 blur-xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* Enhanced Features Section */}
          <section className="py-20 md:py-28">
            <div className="container">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="mb-4">
                  Features
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Everything you need for
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {" "}
                    successful mentorship
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Peptok provides all the tools and features necessary to build,
                  manage, and measure effective mentorship programs at
                  enterprise scale.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={index}
                      className="group border-border/50 hover:border-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm"
                    >
                      <CardHeader className="space-y-4">
                        <div
                          className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-blue-700 transition-colors duration-300">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Enhanced Social Proof */}
          <section className="py-20 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-transparent to-blue-600/5"></div>
            <div className="container relative">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="mb-4">
                  Trusted Worldwide
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Trusted by leading companies worldwide
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join hundreds of organizations already transforming their
                  workforce development
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                {[
                  "JHSC",
                  "InnovateCo",
                  "HarvardH2A",
                  "UNB",
                  "NextGen",
                  "FutureTech",
                ].map((company, index) => (
                  <div key={company} className="text-center">
                    <div className="h-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl group">
                      <span className="font-bold text-muted-foreground group-hover:text-blue-700 transition-colors duration-300">
                        {company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Testimonials */}
          <section className="py-20 md:py-28">
            <div className="container">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="mb-4">
                  Customer Stories
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  What our customers say
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  See how organizations are achieving measurable results with
                  Peptok
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={index}
                    className="relative backdrop-blur-sm bg-white/90 border-white/20 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  >
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 border-green-200"
                      >
                        {testimonial.impact}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar className="ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
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
                          <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">
                            {testimonial.name}
                          </CardTitle>
                          <CardDescription className="font-medium">
                            {testimonial.role}
                          </CardDescription>
                          <p className="text-sm text-primary font-semibold">
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
                              className="h-5 w-5 fill-yellow-400 text-yellow-400"
                            />
                          ),
                        )}
                      </div>
                      <blockquote className="text-muted-foreground relative italic leading-relaxed">
                        <Quote className="absolute -top-2 -left-2 h-6 w-6 text-blue-200" />
                        {testimonial.quote}
                      </blockquote>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Pricing */}
          <section className="py-20 md:py-28 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/50 relative">
            <div className="absolute inset-0 bg-gradient-to-l from-blue-400/5 via-transparent to-blue-600/5"></div>
            <div className="container relative">
              <div className="text-center space-y-4 mb-16">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Badge variant="outline">Pricing</Badge>
                  <BackendStatus />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Simple, transparent pricing
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Choose the plan that's right for your organization. Start
                  immediately with any plan - no trial period needed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {loadingPlans ? (
                  // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={index}
                      className="relative backdrop-blur-sm bg-white/90 border-white/20 shadow-xl"
                    >
                      <CardHeader className="text-center space-y-4">
                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-4 bg-gray-200 rounded animate-pulse"
                            ></div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : pricingPlans.length === 0 ? (
                  <div className="col-span-3 text-center py-8">
                    <div className="text-gray-500">
                      <p>Unable to load pricing plans at the moment.</p>
                      <p className="text-sm mt-2">
                        Please refresh the page or try again later.
                      </p>
                    </div>
                  </div>
                ) : (
                  pricingPlans.map((plan) => {
                    const isPopular = plan.badge === "Best Value";
                    const price = plan.customPricing
                      ? "Custom"
                      : `${plan.currency || "CA"}$${plan.price}`;
                    const period = plan.customPricing
                      ? "pricing"
                      : "per user/month";

                    return (
                      <Card
                        key={plan.id}
                        className={`relative backdrop-blur-sm bg-white/90 border-white/20 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isPopular ? "ring-2 ring-blue-500 scale-105" : ""}`}
                      >
                        {plan.badge && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge
                              className={`${isPopular ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white" : "bg-gray-100 text-gray-700"} shadow-lg`}
                            >
                              {plan.badge}
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="text-center space-y-4">
                          <CardTitle className="text-2xl">
                            {plan.name}
                          </CardTitle>
                          <div>
                            <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                              {price}
                            </span>
                            <span className="text-muted-foreground">
                              /{period}
                            </span>
                          </div>
                          {plan.minimumUsers && plan.minimumUsers > 1 && (
                            <p className="text-sm text-muted-foreground">
                              Minimum {plan.minimumUsers} users
                            </p>
                          )}
                          <CardDescription className="text-base">
                            {plan.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <ul className="space-y-4">
                            {plan.features
                              .slice(0, 5)
                              .map((feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="flex items-center space-x-3"
                                >
                                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                          </ul>
                          {plan.extraSeatPrice && plan.extraSeatPrice > 0 && (
                            <div className="pt-2 border-t">
                              <p className="text-xs text-muted-foreground">
                                Additional seats: {plan.currency || "CA"}$
                                {plan.extraSeatPrice}/user/month
                              </p>
                            </div>
                          )}
                          <Button
                            className={`w-full transition-all duration-300 hover:scale-105 ${isPopular ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg" : ""}`}
                            variant={isPopular ? "default" : "outline"}
                            size="lg"
                            onClick={() => navigate("/signup")}
                          >
                            {plan.customPricing ? "Contact Sales" : "Start Now"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* Enhanced CTA Section */}
          <section className="py-20 md:py-28">
            <div className="container">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <Badge variant="outline" className="mb-4">
                  Get Started
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to transform your workforce development?
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join leading companies using Peptok to connect their
                  enterprises with coach mentors and drive measurable business
                  outcomes. Get started today.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  >
                    <Link to="/signup">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg border-blue-200 hover:border-blue-300 group"
                  >
                    <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Schedule Demo
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Instant access</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
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
