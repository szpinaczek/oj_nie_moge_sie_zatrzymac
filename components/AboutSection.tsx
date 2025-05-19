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
    <div className="w-full flex flex-col lg:flex-row justify-between gap-6 p-0 m-0 border-0">
      <Card className="order-0 bg-brown-50 dark:bg-brown-700 flex-col md:flex-row shadow-md border-0 m-0 w-full lg:min-w-[50%]">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-brown-900 dark:text-brown-100">
            {getTranslation('about', language)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md text-brown-900 dark:text-brown-100">
            {getTranslation('aboutApp', language)}
          </p>
        </CardContent>
      </Card>
      <Card className="order-1 bg-brown-50 dark:bg-brown-700 flex-col md:flex-row border-0">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-brown-900 dark:text-brown-100">
            {getTranslation('aboutMovie', language)}
          </CardTitle>
          {/* <p className="text-md text-brown-900 dark:text-brown-100">
            {getTranslation('aboutApp', language)}
          </p> */}
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
              <p className="text-md text-brown-900 dark:text-brown-100">
                {getTranslation('filmDescription', language)}
              </p> 
              <div className="grid gap-4">
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('filmYear', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">1975</span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('filmDuration', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">10:30</span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('filmTechnique', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('filmTechniqueValue', language)}
                  </span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('filmAwards', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('filmAwardsValue', language)}
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="director" className="space-y-4">
              <p className="text-md text-brown-900 dark:text-brown-100">
                {getTranslation('directorDescription', language)}
              </p>
              <div className="grid gap-4">
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('directorBorn', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">1949</span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('directorEducation', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('directorEducationValue', language)}
                  </span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('directorAchievements', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('directorAchievementsValue', language)}
                  </span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('directorLegacy', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('directorLegacyValue', language)}
                  </span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="location" className="space-y-4">
              <p className="text-md text-brown-900 dark:text-brown-100">
                {getTranslation('locationDescription', language)}
              </p>
              <div className="grid gap-4">
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('locationCity', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('locationCityValue', language)}
                  </span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('locationStudio', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('locationStudioValue', language)}
                  </span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('locationSignificance', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
                    {getTranslation('locationSignificanceValue', language)}
                  </span>
                </div>
                <div className="flex items-top gap-2">
                  <span className="font-semibold text-brown-900 dark:text-brown-100">
                    {getTranslation('locationToday', language)}:
                  </span>
                  <span className="text-brown-900 dark:text-brown-100">
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