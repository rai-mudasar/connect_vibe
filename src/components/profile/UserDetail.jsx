"use client";

import React from "react";
import { 
  MapPin, 
  Briefcase, 
  Heart, 
  Calendar, 
  Info 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format, isValid } from "date-fns";

export default function UserDetail({ currentProfileUser }) {

  
  const getJoinedDateDisplay = (dateValue) => {
    if (!dateValue) return "Recently";
    const date = new Date(dateValue);
    if (!isValid(date)) return "Recently";
    return format(date, "MMMM yyyy");
  };
  
  const joinedDate = getJoinedDateDisplay(currentProfileUser?.createdAt);

  const details = [
    {
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      label: "Occupation",
      value: currentProfileUser?.occupation,
      prefix: "Works as ",
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      label: "Location",
      value: currentProfileUser?.location,
      prefix: "Lives in ",
    },
    {
      icon: <Heart className="h-5 w-5 text-primary" />,
      label: "Relationship",
      value: currentProfileUser?.relationshipStatus && currentProfileUser.relationshipStatus !== "None" ? currentProfileUser.relationshipStatus : null,
      prefix: "Relationship Status ",
    },
    {
      icon: <Calendar className="h-5 w-5 text-primary" />,
      label: "Joined",
      value: joinedDate,
      prefix: "Joined ",
    },
  ];

  return (
    <Card className="w-full shadow-sm border-none bg-bg-white1">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-text1">Personal Detail</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {currentProfileUser?.bio && (
          <div className="text-center pb-2 border-b border-border">
            <p className="text-[15px] text-primary italic">"{currentProfileUser.bio}"</p>
          </div>
        )}

        {/* Mapped Details */}
        <div className="space-y-3">
          {details.map((detail, index) => (
            detail.value ? (
              <div key={index} className="flex items-center gap-3 text-[15px]">
                {detail.icon}
                <p>
                  <span className="text-text2">{detail.prefix}</span>
                  <span className="font-semibold text-text1">{detail.value}</span>
                </p>
              </div>
            ) : null
          ))}
        </div>

        {/* If no details are available yet */}
        {!currentProfileUser?.bio && !currentProfileUser?.occupation && !currentProfileUser?.location && (
          <div className="flex flex-col items-center gap-2 py-4 text-gray-500">
            <Info size={32} strokeWidth={1} />
            <p className="text-sm">No profile details to show.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}