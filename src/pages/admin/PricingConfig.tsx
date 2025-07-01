import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  Save,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { apiEnhanced } from "@/services/apiEnhanced";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";

interface PricingConfiguration {
  companyServiceFee: number;
  coachCommission: number;
  additionalParticipantFee: number;
  maxParticipantsIncluded: number;
  currency: string;
  lastUpdated: string;
}

export default function PricingConfig() {
  const { user } = useAuth();
  const [config, setConfig] = useState<PricingConfiguration>({
    companyServiceFee: 0.1,
    coachCommission: 0.2,
    additionalParticipantFee: 25,
    maxParticipantsIncluded: 1,
    currency: "CAD",
    lastUpdated: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPricingConfig();
  }, []);

  const fetchPricingConfig = async () => {
    try {
      setLoading(true);
      const pricingConfig = await apiEnhanced.getPricingConfig();
      setConfig(pricingConfig);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to fetch pricing config:", error);
      toast.error("Failed to load pricing configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (
    field: keyof PricingConfiguration,
    value: any,
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiEnhanced.updatePricingConfig({
        ...config,
        lastUpdated: new Date().toISOString(),
      });
      setHasChanges(false);
      toast.success("Pricing configuration updated successfully");
    } catch (error) {
      console.error("Failed to save pricing config:", error);
      toast.error("Failed to save pricing configuration");
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
      companyServiceFee: 0.1,
      coachCommission: 0.2,
      additionalParticipantFee: 25,
      maxParticipantsIncluded: 1,
      currency: "CAD",
      lastUpdated: new Date().toISOString(),
    });
    setHasChanges(true);
  };

  if (user?.userType !== "platform_admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">
              Only platform administrators can access pricing configuration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading pricing configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="w-8 h-8 text-blue-600" />
                  Pricing Configuration
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage platform pricing structure and commission rates
                </p>
              </div>
              <div className="flex items-center gap-3">
                {hasChanges && (
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-200"
                  >
                    Unsaved Changes
                  </Badge>
                )}
                <Button
                  onClick={resetToDefaults}
                  variant="outline"
                  disabled={saving}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave} disabled={!hasChanges || saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Company Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyServiceFee">
                    Service Fee Percentage
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="companyServiceFee"
                      type="number"
                      min="0"
                      max="50"
                      step="0.01"
                      value={(config.companyServiceFee * 100).toFixed(2)}
                      onChange={(e) =>
                        handleConfigChange(
                          "companyServiceFee",
                          parseFloat(e.target.value) / 100,
                        )
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-8">%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Percentage charged to companies on top of coach rates and
                    additional participant fees
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalParticipantFee">
                    Additional Participant Fee
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-8">
                      {config.currency}$
                    </span>
                    <Input
                      id="additionalParticipantFee"
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={config.additionalParticipantFee}
                      onChange={(e) =>
                        handleConfigChange(
                          "additionalParticipantFee",
                          parseFloat(e.target.value),
                        )
                      }
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Fee charged per additional participant beyond the included
                    participants
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipantsIncluded">
                    Participants Included in Base Price
                  </Label>
                  <Input
                    id="maxParticipantsIncluded"
                    type="number"
                    min="1"
                    max="20"
                    step="1"
                    value={config.maxParticipantsIncluded}
                    onChange={(e) =>
                      handleConfigChange(
                        "maxParticipantsIncluded",
                        parseInt(e.target.value),
                      )
                    }
                    className="flex-1"
                  />
                  <p className="text-sm text-gray-600">
                    Number of participants included in base session price.
                    Additional fees apply beyond this count.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Company Pricing Example
                  </h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div>Coach Rate: $150/hour</div>
                    <div>
                      3 Participants (2 additional): 2 × $
                      {config.additionalParticipantFee} = $
                      {config.additionalParticipantFee * 2}
                    </div>
                    <div>
                      Subtotal: $150 + ${config.additionalParticipantFee * 2} =
                      ${150 + config.additionalParticipantFee * 2}
                    </div>
                    <div>
                      Service Fee ({(config.companyServiceFee * 100).toFixed(1)}
                      %): $
                      {(
                        (150 + config.additionalParticipantFee * 2) *
                        config.companyServiceFee
                      ).toFixed(2)}
                    </div>
                    <div className="font-semibold border-t border-blue-300 pt-1 mt-2">
                      Total: $
                      {(
                        150 +
                        config.additionalParticipantFee * 2 +
                        (150 + config.additionalParticipantFee * 2) *
                          config.companyServiceFee
                      ).toFixed(2)}{" "}
                      {config.currency}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coach Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Coach Commission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="coachCommission">Commission Percentage</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="coachCommission"
                      type="number"
                      min="0"
                      max="50"
                      step="0.01"
                      value={(config.coachCommission * 100).toFixed(2)}
                      onChange={(e) =>
                        handleConfigChange(
                          "coachCommission",
                          parseFloat(e.target.value) / 100,
                        )
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 w-8">%</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Percentage of session revenue retained as platform
                    commission from coaches
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    type="text"
                    value={config.currency}
                    onChange={(e) =>
                      handleConfigChange("currency", e.target.value)
                    }
                    className="flex-1"
                    placeholder="CAD"
                  />
                  <p className="text-sm text-gray-600">
                    Primary currency for all platform transactions
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Coach Earnings Example
                  </h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>Session Revenue: $150/hour</div>
                    <div>
                      Platform Commission (
                      {(config.coachCommission * 100).toFixed(1)}%): $
                      {(150 * config.coachCommission).toFixed(2)}
                    </div>
                    <div className="font-semibold border-t border-green-300 pt-1 mt-2">
                      Coach Earnings: $
                      {(150 * (1 - config.coachCommission)).toFixed(2)}{" "}
                      {config.currency}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Summary */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Configuration Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Company Revenue Per Session
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {(config.companyServiceFee * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-blue-700">of total session cost</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Coach Revenue Per Session
                  </h4>
                  <p className="text-2xl font-bold text-green-600">
                    {(config.coachCommission * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-700">
                    commission on earnings
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Additional Participant
                  </h4>
                  <p className="text-2xl font-bold text-purple-600">
                    ${config.additionalParticipantFee}
                  </p>
                  <p className="text-sm text-purple-700">
                    per extra participant
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Platform-Wide Implementation
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="font-semibold text-green-900">
                        Active Components
                      </div>
                      <div className="text-green-700">
                        • Pricing Calculator
                        <br />
                        • Mentorship Request Costs
                        <br />
                        • Session Management
                        <br />• Coach Earnings Display
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="font-semibold text-blue-900">
                        Usage Impact
                      </div>
                      <div className="text-blue-700">
                        • All company cost estimates
                        <br />
                        • Coach commission calculations
                        <br />
                        • Session pricing displays
                        <br />• Revenue tracking
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>
                    Last updated:{" "}
                    {new Date(config.lastUpdated).toLocaleString()}
                  </p>
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Changes will be reflected across
                      all pricing displays and calculations immediately after
                      saving.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
