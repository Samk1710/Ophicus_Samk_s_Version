import React from 'react';
import { Card } from "@/components/ui/card";
import { CelestialIcon } from "@/components/celestial-icon";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonStatsCardProps {
  size: 'sm' | 'md' | 'lg';
}

export function SkeletonStatsCard({ size }: SkeletonStatsCardProps) {
  const sizeClasses = {
    sm: "col-span-1 row-span-1",
    md: "col-span-1 row-span-2 md:col-span-2",
    lg: "col-span-1 row-span-2 md:col-span-2 lg:col-span-3",
  }

  return (
    <Card className={`glassmorphism border-purple-400/30 p-6 ${sizeClasses[size]} relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded-full" />
            <CelestialIcon type="mystical" className="text-purple-400 opacity-50" />
          </div>
          <div className="text-right">
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="mb-2">
          <Skeleton className="h-8 w-full mb-2" />
          {size !== 'sm' && <Skeleton className="h-4 w-3/4" />}
        </div>
      </div>
    </Card>
  );
}

export function SkeletonCurrentTrack() {
  return (
    <Card className="glassmorphism border-gold-400/30 p-6 max-w-2xl w-full">
      <div className="flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-2 w-full mb-3" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function SkeletonRecentTracks() {
  return (
    <Card className="glassmorphism border-gold-400/30 p-8 max-w-4xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <CelestialIcon type="constellation" className="text-gold-400" />
        <h2 className="font-cinzel text-2xl font-bold text-gold-100">Recent Celestial Journeys</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-purple-400/20"
          >
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </Card>
  );
}
