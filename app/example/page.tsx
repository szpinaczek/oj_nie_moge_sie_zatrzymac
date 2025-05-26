"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";

export default function ExamplePage() {
  const { theme } = useTheme();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gradient Background Example</h1>
        <ThemeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Brown Card */}
        <Card className="bg-brown-100/80 dark:bg-brown-800/80 backdrop-blur-sm border-brown-200 dark:border-brown-700">
          <CardHeader>
            <CardTitle className="text-brown-900 dark:text-brown-100">Brown Palette</CardTitle>
            <CardDescription className="text-brown-700 dark:text-brown-300">
              Showcasing the brown color palette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="h-8 bg-brown-50 rounded"></div>
              <div className="h-8 bg-brown-100 rounded"></div>
              <div className="h-8 bg-brown-200 rounded"></div>
              <div className="h-8 bg-brown-300 rounded"></div>
              <div className="h-8 bg-brown-400 rounded"></div>
              <div className="h-8 bg-brown-500 rounded"></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Orange Card */}
        <Card className="bg-orange-100/80 dark:bg-orange-900/30 backdrop-blur-sm border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100">Orange Palette</CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Showcasing the orange color palette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="h-8 bg-orange-50 rounded"></div>
              <div className="h-8 bg-orange-100 rounded"></div>
              <div className="h-8 bg-orange-200 rounded"></div>
              <div className="h-8 bg-orange-300 rounded"></div>
              <div className="h-8 bg-orange-400 rounded"></div>
              <div className="h-8 bg-orange-500 rounded"></div>
            </div>
          </CardContent>
        </Card>
        
        {/* Pink Card */}
        <Card className="bg-pink-100/80 dark:bg-pink-900/30 backdrop-blur-sm border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="text-pink-900 dark:text-pink-100">Pink Palette</CardTitle>
            <CardDescription className="text-pink-700 dark:text-pink-300">
              Showcasing the pink color palette
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="h-8 bg-pink-50 rounded"></div>
              <div className="h-8 bg-pink-100 rounded"></div>
              <div className="h-8 bg-pink-200 rounded"></div>
              <div className="h-8 bg-pink-300 rounded"></div>
              <div className="h-8 bg-pink-400 rounded"></div>
              <div className="h-8 bg-pink-500 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Animated Gradient Background</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          This page demonstrates the animated gradient background using colors from the brown, orange, and pink palettes.
          The background adapts to light and dark modes automatically.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-pink-500 hover:bg-pink-600 text-white"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}