"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTranslation } from "@/app/i18n/translations";
import { Language } from "@/types/map";

interface AboutSectionProps {
  language: Language;
}

export function AboutSection({ language }: AboutSectionProps) {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{getTranslation("about", language)}</CardTitle>
          <CardDescription>{getTranslation("aboutApp", language)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="film" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="film">{getTranslation("aboutFilm", language)}</TabsTrigger>
              <TabsTrigger value="director">{getTranslation("aboutDirector", language)}</TabsTrigger>
              <TabsTrigger value="location">{getTranslation("location", language)}</TabsTrigger>
            </TabsList>
            <TabsContent value="film" className="mt-4">
              <div className="space-y-4">
                <p>{getTranslation("filmDescription", language)}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">{getTranslation("filmYear", language)}</h4>
                    <p>1975</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("filmDuration", language)}</h4>
                    <p>10:30</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("filmTechnique", language)}</h4>
                    <p>{getTranslation("filmTechniqueValue", language)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("filmAwards", language)}</h4>
                    <p>{getTranslation("filmAwardsValue", language)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="director" className="mt-4">
              <div className="space-y-4">
                <p>{getTranslation("directorDescription", language)}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">{getTranslation("directorBorn", language)}</h4>
                    <p>1949</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("directorEducation", language)}</h4>
                    <p>{getTranslation("directorEducationValue", language)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("directorAchievements", language)}</h4>
                    <p>{getTranslation("directorAchievementsValue", language)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("directorLegacy", language)}</h4>
                    <p>{getTranslation("directorLegacyValue", language)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="location" className="mt-4">
              <div className="space-y-4">
                <p>{getTranslation("locationDescription", language)}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">{getTranslation("locationCity", language)}</h4>
                    <p>{getTranslation("locationCityValue", language)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("locationStudio", language)}</h4>
                    <p>{getTranslation("locationStudioValue", language)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("locationSignificance", language)}</h4>
                    <p>{getTranslation("locationSignificanceValue", language)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">{getTranslation("locationToday", language)}</h4>
                    <p>{getTranslation("locationTodayValue", language)}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 