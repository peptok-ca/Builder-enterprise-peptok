import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Users,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Target,
  TrendingUp,
  Shield,
} from "lucide-react";
import { BackendStatus } from "@/components/ui/BackendStatus";

const PLATFORM_SERVICE_FEE = 0.15; // 15%
const ADDITIONAL_PARTICIPANT_FEE = 25; // $25 CAD per additional participant

export default function Pricing() {
  const [sessions, setSessions] = useState<number>(5);
  const [participants, setParticipants] = useState<number>(1);
  const [coachRate, setCoachRate] = useState<number>(150);
  const [sessionDuration, setSessionDuration] = useState<number>(60);

  const calculateCosts = () => {
    const sessionCost = (coachRate * sessionDuration) / 60;
    const baseSessionsCost = sessions * sessionCost;

    // Additional participants (beyond the first one)
    const additionalParticipants = Math.max(0, participants - 1);
    const additionalParticipantsCost =
      sessions * additionalParticipants * ADDITIONAL_PARTICIPANT_FEE;

    const subtotal = baseSessionsCost + additionalParticipantsCost;
    const platformFee = subtotal * PLATFORM_SERVICE_FEE;
    const totalCost = subtotal + platformFee;

    return {
      sessionCost,
      baseSessionsCost,
      additionalParticipantsCost,
      subtotal,
      platformFee,
      totalCost,
      coachEarnings: baseSessionsCost,
      averageCostPerSession: totalCost / sessions,
    };
  };

  const costs = calculateCosts();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50/30 via-white to-blue-100/30 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/6 rounded-full blur-3xl"></div>
          </div>

          <div className="container relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="outline">Pricing</Badge>
                <BackendStatus />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Pay per session with no hidden fees. Calculate your exact costs
                and scale your coaching programs with complete transparency.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No monthly subscriptions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pay only for sessions used</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No long-term commitments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Model Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  How Our Pricing Works
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Our simple, session-based pricing model ensures you only pay
                  for the coaching your team actually receives.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>Coach Sets Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Professional coaches set their own hourly rates based on
                      their expertise and experience.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle>Add Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      First participant included. Additional participants are
                      $25 CAD each per session.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle>Platform Fee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      15% platform service fee covers matching, support,
                      payments, and quality assurance.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Pricing Formula */}
              <Card className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 border-blue-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Pricing Formula</CardTitle>
                  <CardDescription>
                    Transparent calculation for every session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/80 p-6 rounded-lg">
                    <div className="text-center space-y-2">
                      <div className="text-lg font-mono">
                        <span className="text-blue-600 font-semibold">
                          Session Cost
                        </span>{" "}
                        = (Coach Rate × Session Duration) + (Additional
                        Participants × $25) + (15% Platform Fee)
                      </div>
                      <p className="text-sm text-muted-foreground">
                        All pricing in Canadian Dollars (CAD)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cost Calculator */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50/50 to-gray-100/50">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3">
                  <Calculator className="w-8 h-8 text-blue-600" />
                  Cost Calculator
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Estimate your coaching program costs based on your specific
                  needs
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Calculator Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Program Details
                    </CardTitle>
                    <CardDescription>
                      Customize your coaching program parameters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sessions">Number of Sessions</Label>
                        <Input
                          id="sessions"
                          type="number"
                          min="1"
                          max="50"
                          value={sessions}
                          onChange={(e) =>
                            setSessions(parseInt(e.target.value) || 1)
                          }
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Total sessions in the program
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="participants">
                          Participants per Session
                        </Label>
                        <Input
                          id="participants"
                          type="number"
                          min="1"
                          max="20"
                          value={participants}
                          onChange={(e) =>
                            setParticipants(parseInt(e.target.value) || 1)
                          }
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Number of people per session
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="coach-rate">
                          Coach Rate (CAD/hour)
                        </Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="coach-rate"
                            type="number"
                            min="50"
                            max="1000"
                            step="10"
                            value={coachRate}
                            onChange={(e) =>
                              setCoachRate(parseInt(e.target.value) || 150)
                            }
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estimated coach hourly rate
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="duration">Session Duration</Label>
                        <Select
                          value={sessionDuration.toString()}
                          onValueChange={(value) =>
                            setSessionDuration(parseInt(value))
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                            <SelectItem value="120">120 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                          Duration per session
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Cost Breakdown
                    </CardTitle>
                    <CardDescription>
                      Detailed cost analysis for your program
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Coach earnings ({sessions} × $
                          {costs.sessionCost.toFixed(0)})
                        </span>
                        <span className="font-medium">
                          ${costs.baseSessionsCost.toFixed(2)}
                        </span>
                      </div>

                      {costs.additionalParticipantsCost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Additional participants ({sessions} ×{" "}
                            {participants - 1} × $
                            {pricingConfig.additionalParticipantFee})
                          </span>
                          <span className="font-medium">
                            ${costs.additionalParticipantsCost.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Subtotal
                        </span>
                        <span className="font-medium">
                          ${costs.subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Platform service fee (
                          {(pricingConfig.companyServiceFee * 100).toFixed(0)}%)
                        </span>
                        <span className="font-medium">
                          ${costs.platformFee.toFixed(2)}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">
                          Total Program Cost
                        </span>
                        <span className="font-bold text-blue-600">
                          ${costs.totalCost.toFixed(2)} {pricingConfig.currency}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Average per session
                        </span>
                        <span className="text-sm font-medium">
                          ${costs.averageCostPerSession.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-blue-900">
                            Cost Optimization Tips
                          </p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>
                              • Longer sessions often provide better value per
                              minute
                            </li>
                            <li>
                              • Group sessions reduce per-person costs
                              significantly
                            </li>
                            <li>
                              • Regular programs help maintain coaching momentum
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-muted-foreground">
                  Everything you need to know about our pricing model
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Why session-based pricing?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Session-based pricing provides maximum flexibility and
                      transparency. You only pay for the coaching your team
                      actually receives, with no monthly commitments or hidden
                      fees.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      How do coach rates work?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Coaches set their own rates based on their expertise and
                      experience. Rates typically range from $100-300 CAD per
                      hour, with most coaches charging $150-200 CAD per hour.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      What's included in the platform fee?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      The 15% platform fee covers coach matching, payment
                      processing, quality assurance, customer support, session
                      recordings, and progress tracking tools.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Can I cancel or reschedule sessions?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, sessions can be rescheduled with 24 hours notice.
                      Cancellations made less than 24 hours in advance may incur
                      a partial charge as per our cancellation policy.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Start your coaching program today with our transparent,
                pay-per-session pricing model.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  <Link to="/signup">
                    Create Your Program
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
