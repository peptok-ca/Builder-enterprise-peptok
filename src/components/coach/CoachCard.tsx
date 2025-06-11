import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Award,
  Users,
} from "lucide-react";
import { Coach } from "@/types";

interface CoachCardProps {
  coach: Coach;
}

const CoachCard = ({ coach }: CoachCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={coach.avatar} alt={coach.name} />
            <AvatarFallback>
              {coach.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {coach.name}
            </h3>
            <p className="text-sm text-muted-foreground">{coach.title}</p>
            <p className="text-sm text-primary font-medium">{coach.company}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{coach.bio}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {coach.coaching.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
          {coach.coaching.length > 3 && (
            <Badge variant="outline">+{coach.coaching.length - 3} more</Badge>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{coach.rating}</span>
            <span>({coach.totalSessions} sessions)</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{coach.experience}y exp</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Next available: {coach.availableSlots[0]}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link to={`/coaches/${coach.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoachCard;
