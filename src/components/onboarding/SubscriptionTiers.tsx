import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SubscriptionTier } from "@/types";

interface SubscriptionTiersProps {
  onSelectTier: (tier: SubscriptionTier) => void;
  onBack?: () => void;
  selectedTier?: string;
  isLoading?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams getting started with mentorship",
    price: 49,
    billingPeriod: "monthly",
    userCap: 10,
    supportLevel: "basic",
    customizations: false,
    analytics: "basic",
    features: [
      "Up to 10 team members",
      "Basic mentor matching",
      "Email support",
      "Core analytics",
      "Monthly progress reports",
      "Basic goal tracking",
    ],
    metricsIncluded: [
      "Employee satisfaction",
      "Session completion rate",
      "Basic engagement metrics",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    description: "Ideal for growing companies with expanding mentorship needs",
    price: 99,
    billingPeriod: "monthly",
    userCap: 50,
    supportLevel: "premium",
    customizations: true,
    analytics: "advanced",
    features: [
      "Up to 50 team members",
      "AI-powered mentor matching",
      "Priority email & chat support",
      "Advanced analytics dashboard",
      "Weekly progress reports",
      "Goal tracking with milestones",
      "Custom mentorship programs",
      "Team performance insights",
      "Skills assessment tools",
    ],
    metricsIncluded: [
      "Employee satisfaction",
      "Session completion rate",
      "Skill development progress",
      "Team collaboration metrics",
      "ROI tracking",
      "Department comparisons",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Comprehensive solution for large organizations",
    price: 0, // Custom pricing
    billingPeriod: "monthly",
    userCap: 999999,
    supportLevel: "enterprise",
    customizations: true,
    analytics: "enterprise",
    features: [
      "Unlimited team members",
      "Dedicated success manager",
      "24/7 priority support",
      "Enterprise analytics suite",
      "Real-time reporting",
      "Advanced goal management",
      "Custom integrations",
      "White-label options",
      "API access",
      "SSO integration",
      "Advanced security features",
      "Custom mentor vetting",
    ],
    metricsIncluded: [
      "All Growth metrics plus:",
      "Custom KPI tracking",
      "Predictive analytics",
      "Benchmark comparisons",
      "Executive dashboards",
      "Multi-department insights",
    ],
  },
];

export function SubscriptionTiers({
  onSelectTier,
  onBack,
  selectedTier,
  isLoading,
}: SubscriptionTiersProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly",
  );

  const getIcon = (tierId: string) => {
    switch (tierId) {
      case "starter":
        return <Zap className="w-6 h-6" />;
      case "growth":
        return <Crown className="w-6 h-6" />;
      case "enterprise":
        return <Building2 className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getPrice = (tier: SubscriptionTier) => {
    if (tier.id === "enterprise") {
      return "Custom";
    }

    const monthlyPrice = tier.price;
    const annualPrice = Math.round(monthlyPrice * 12 * 0.8); // 20% discount for annual

    if (billingPeriod === "annual") {
      return `$${annualPrice}/year`;
    }

    return `$${monthlyPrice}/month`;
  };

  const getSavings = (tier: SubscriptionTier) => {
    if (tier.id === "enterprise" || billingPeriod === "monthly") return null;

    const monthlyTotal = tier.price * 12;
    const annualPrice = Math.round(monthlyTotal * 0.8);
    const savings = monthlyTotal - annualPrice;

    return `Save $${savings}/year`;
  };

  return (
    <div className="space-y-6">
      {/* Billing Period Toggle */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
          <Button
            type="button"
            variant={billingPeriod === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("monthly")}
            className="relative"
          >
            Monthly
          </Button>
          <Button
            type="button"
            variant={billingPeriod === "annual" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("annual")}
            className="relative"
          >
            Annual
            <Badge variant="secondary" className="ml-1 text-xs">
              20% off
            </Badge>
          </Button>
        </div>
      </div>

      {/* Subscription Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionTiers.map((tier) => {
          const isPopular = tier.id === "growth";
          const isSelected = selectedTier === tier.id;

          return (
            <Card
              key={tier.id}
              className={cn(
                "relative cursor-pointer transition-all duration-200 hover:shadow-lg",
                {
                  "ring-2 ring-primary": isSelected,
                  "border-primary shadow-lg": isPopular,
                },
              )}
              onClick={() => onSelectTier(tier)}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2 text-primary">
                  {getIcon(tier.id)}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-sm">
                  {tier.description}
                </CardDescription>

                <div className="pt-4">
                  <div className="text-4xl font-bold text-primary">
                    {getPrice(tier)}
                  </div>
                  {getSavings(tier) && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      {getSavings(tier)}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">
                    {tier.id === "enterprise"
                      ? "Contact sales"
                      : `per ${billingPeriod}`}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-semibold">
                      {tier.userCap === 999999 ? "Unlimited" : tier.userCap}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Team Members
                    </div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-semibold capitalize">
                      {tier.analytics}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Analytics
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {tier.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metrics Included */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Metrics Included:</h4>
                  <ul className="space-y-1">
                    {tier.metricsIncluded.map((metric, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className={cn("w-full mt-6", isSelected && "bg-primary")}
                  variant={isSelected ? "default" : "outline"}
                  disabled={isLoading}
                >
                  {isSelected
                    ? "Selected"
                    : tier.id === "enterprise"
                      ? "Contact Sales"
                      : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Information */}
      <div className="text-center space-y-2 text-sm text-muted-foreground">
        <p>
          All plans include a 14-day free trial • No setup fees • Cancel anytime
        </p>
        <p>
          Need more team members? Additional seats available for $5/user/month
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between pt-6">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        {selectedTier && (
          <Button
            onClick={() => {
              const tier = subscriptionTiers.find((t) => t.id === selectedTier);
              if (tier) onSelectTier(tier);
            }}
            disabled={isLoading}
            className="ml-auto"
          >
            {isLoading ? "Processing..." : "Continue to Payment"}
          </Button>
        )}
      </div>
    </div>
  );
}
