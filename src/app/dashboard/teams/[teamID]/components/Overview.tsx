/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTeamByID } from "@/hooks/teams/useTeamsByID";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Label, SectionTitle } from "@/components/type/titles";
import { P } from "@/components/type/type";
import { Card, CardContent } from "@/components/ui/card";

// TODO: Add Overview Tab
export default function OverviewTab() {
  const { teamID } = useParams();
  const { data, isLoading, isError } = useTeamByID(Number(teamID));
  const team = data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading team data</div>;

  if (!team) return <div>No team data found</div>;

  const club = team.club;
  const competition = team.competition;
  //const association = competition?.association?.data?.attributes;

  return (
    <div className="space-y-2 ">
      {/* Team Header */}
      <SectionTitle>{team.TopLineData.teamName}</SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Club Info */}
        <Card className="w-full shadow-none bg-slate-50 border-l-4 border-l-slate-500">
          <CardContent className="p-2">
            <Label className="font-semibold">Club Details</Label>
            {club?.ParentLogo && (
              <div className="relative h-16 w-16 mb-2">
                <Image
                  src={club.ParentLogo}
                  alt={club.Name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <P className="text-gray-600">{club?.Name}</P>
            {club?.website?.website && (
              <Link
                href={club.website.website}
                target="_blank"
                className="text-blue-600 hover:underline">
                Club Website
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Competition Info */}
        <Card className="w-full shadow-none bg-slate-50 border-l-4 border-l-slate-500">
          <CardContent className="p-2">
            <Label className="font-semibold">Competition</Label>
            <P className="text-gray-600">{competition?.competitionName}</P>
            <P className="text-gray-600">Season: {competition?.season}</P>
            <P className="text-gray-600">Status: {competition?.status}</P>
          </CardContent>
        </Card>
        {/* Stats */}
        <Card className="w-full shadow-none bg-slate-50 border-l-4 border-l-slate-500">
          <CardContent className="p-2">
            <P className="text-gray-600">
              Games Played: {team.TopLineData.gamesPlayed}
            </P>
            <P className="text-gray-600">Wins: {team.TopLineData.wins}</P>
            <P className="text-gray-600">Losses: {team.TopLineData.losses}</P>
            <P className="text-gray-600">Form: {team.TopLineData.form}</P>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <SectionTitle>Contact Information</SectionTitle>
      {team?.TopLineData?.contactDetails &&
        team?.TopLineData?.contactDetails.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team?.TopLineData?.contactDetails.map(
              (contact: any, index: any) => (
                <div key={index} className="border p-4 rounded-lg">
                  <Label className="font-semibold">{contact.name}</Label>

                  <P className="text-gray-600">{contact.role}</P>
                  <P className="text-gray-600">Phone: {contact.phone}</P>
                  <Link
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:underline">
                    {contact.email}
                  </Link>
                </div>
              )
            )}
          </div>
        )}

      {/* Location */}
      {club?.location?.address && (
        <div className="border p-4 rounded-lg">
          <Label className="text-xl font-bold mb-2">Location</Label>
          <P className="text-gray-600">{club.location.address}</P>
        </div>
      )}
    </div>
  );
}
