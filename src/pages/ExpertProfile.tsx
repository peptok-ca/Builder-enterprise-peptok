import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Calendar,
  Users,
  MessageSquare,
  Video,
  Clock,
  Award,
  BookOpen,
  Target,
} from "lucide-react";
import { mockExperts } from "@/data/mockData";

const ExpertProfile = () => {
  const { id } = useParams();
  const expert = mockExperts.find((e) => e.id === id) || mockExperts[0];

  // Mock data for this expert
  const reviews = [
    {
      id: "1",
      employeeName: "Alex Johnson",
      rating: 5,
      comment:
        "Sarah is an exceptional mentor. Her insights on leadership have transformed my approach to team management.",
      date: "2 weeks ago",
    },
    {
      id: "2",
      employeeName: "Emily Davis",
      rating: 5,
      comment:
        "Incredible depth of knowledge and very practical advice. Highly recommend!",
      date: "1 month ago",
    },
    {
      id: "3",
      employeeName: "Michael Chen",
      rating: 4,
      comment:
        "Great mentor with excellent communication skills. Sessions are always valuable.",
      date: "2 months ago",
    },
  ];

  const certifications = [
    "Certified Executive Coach (ICF)",
    "Leadership Development Specialist",
    "Agile Certified Practitioner",
    "Product Management Professional",
  ];

  const achievements = [
    "Led engineering teams of 100+ developers",
    "Scaled products from 0 to 10M+ users",
    "Mentored 50+ senior engineers",
    "Speaker at 20+ tech conferences",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userType="employee" />

      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expert Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={expert.avatar} alt={expert.name} />
                    <AvatarFallback className="text-lg">
                      {expert.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="text-2xl font-bold">{expert.name}</h1>
                    <p className="text-muted-foreground">{expert.title}</p>
                    <p className="text-primary font-medium">{expert.company}</p>
                  </div>

                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{expert.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{expert.totalSessions} sessions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="h-4 w-4" />
                      <span>{expert.experience}y exp</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Session
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Video Call
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Availability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {expert.availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{slot}</span>
                    <Button variant="outline" size="xs">
                      Book
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Expertise Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {expert.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About {expert.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {expert.bio}
                    </p>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Key Achievements</span>
                      </h4>
                      <ul className="space-y-2">
                        {achievements.map((achievement, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-3 flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>Certifications</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {certifications.map((cert, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="justify-start"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews & Feedback</CardTitle>
                    <CardDescription>
                      What mentees are saying about {expert.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="space-y-3 p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {review.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">
                                {review.employeeName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {review.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {Array.from({ length: review.rating }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ),
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Shared Resources</span>
                    </CardTitle>
                    <CardDescription>
                      Learning materials and resources shared by {expert.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No resources yet
                      </h3>
                      <p className="text-muted-foreground">
                        Resources will appear here once you start sessions with{" "}
                        {expert.name}.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sessions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Session History</CardTitle>
                    <CardDescription>
                      Your past and upcoming sessions with {expert.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No sessions yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Schedule your first session to get started with{" "}
                        {expert.name}.
                      </p>
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule First Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExpertProfile;
