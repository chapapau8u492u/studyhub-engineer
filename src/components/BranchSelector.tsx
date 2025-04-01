
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Cpu, HardDrive, Building2, Zap } from "lucide-react";

export type Branch = 'mechanical' | 'cse' | 'it' | 'civil' | 'electrical' | null;
export type Year = '1' | '2' | '3' | '4' | null;

interface BranchSelectorProps {
  onSelectBranch: (branch: Branch) => void;
  onSelectYear: (year: Year) => void;
  selectedBranch: Branch;
  selectedYear: Year;
}

const branches = [
  { id: 'mechanical', name: 'Mechanical Engineering', icon: BookOpen, color: 'text-orange-500' },
  { id: 'cse', name: 'Computer Science and Engineering', icon: Cpu, color: 'text-blue-500' },
  { id: 'it', name: 'Information Technology', icon: HardDrive, color: 'text-purple-500' },
  { id: 'civil', name: 'Civil Engineering', icon: Building2, color: 'text-green-500' },
  { id: 'electrical', name: 'Electrical Engineering', icon: Zap, color: 'text-red-500' }
];

const years = ['1', '2', '3', '4'] as const;

const BranchSelector = ({ onSelectBranch, onSelectYear, selectedBranch, selectedYear }: BranchSelectorProps) => {
  return (
    <div className="space-y-8 py-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Select Your Academic Year</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              className="w-24 h-16"
              onClick={() => onSelectYear(year)}
            >
              {year}<sup>{getSuffix(year)}</sup> Year
            </Button>
          ))}
        </div>
      </div>

      {selectedYear && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-center">Select Your Branch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => {
              const Icon = branch.icon;
              return (
                <Card 
                  key={branch.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBranch === branch.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => onSelectBranch(branch.id as Branch)}
                >
                  <CardContent className="flex items-center p-6 space-x-4">
                    <div className={`p-3 rounded-full ${branch.color} bg-opacity-10`}>
                      <Icon className={`h-6 w-6 ${branch.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{branch.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get the correct suffix for the year
function getSuffix(year: string): string {
  if (year === '1') return 'st';
  if (year === '2') return 'nd';
  if (year === '3') return 'rd';
  return 'th';
}

export default BranchSelector;
