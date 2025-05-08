"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTranslation } from "@/app/i18n/translations";
import { Language } from "@/types/map";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AboutSectionProps {
  language: Language;
}

export function AboutSection({ language }: AboutSectionProps) {
  const { theme } = useTheme();

  return (
    <div className="w-full">
      <Card className="w-full border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {getTranslation('about', language)}
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            {getTranslation('aboutApp', language)}
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="film" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="film" className="text-base">
                {getTranslation('aboutFilm', language)}
              </TabsTrigger>
              <TabsTrigger value="director" className="text-base">
                {getTranslation('aboutDirector', language)}
              </TabsTrigger>
              <TabsTrigger value="location" className="text-base">
                {getTranslation('location', language)}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="film" className="space-y-4">
              <p className="text-lg text-muted-foreground">
                {getTranslation('filmDescription', language)}
              </p>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('filmYear', language)}:
                  </span>
                  <span className="text-muted-foreground">1975</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('filmDuration', language)}:
                  </span>
                  <span className="text-muted-foreground">10:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('filmTechnique', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('filmTechniqueValue', language)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('filmAwards', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('filmAwardsValue', language)}
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="director" className="space-y-4">
              <p className="text-lg text-muted-foreground">
                {getTranslation('directorDescription', language)}
              </p>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('directorBorn', language)}:
                  </span>
                  <span className="text-muted-foreground">1949</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('directorEducation', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('directorEducationValue', language)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('directorAchievements', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('directorAchievementsValue', language)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('directorLegacy', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('directorLegacyValue', language)}
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="location" className="space-y-4">
              <p className="text-lg text-muted-foreground">
                {getTranslation('locationDescription', language)}
              </p>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('locationCity', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('locationCityValue', language)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('locationStudio', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('locationStudioValue', language)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('locationSignificance', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('locationSignificanceValue', language)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getTranslation('locationToday', language)}:
                  </span>
                  <span className="text-muted-foreground">
                    {getTranslation('locationTodayValue', language)}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 