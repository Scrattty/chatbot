import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Calendar, TrendingUp, TrendingDown, Brain } from 'lucide-react';

interface MoodEntry {
  userId: string;
  mood: number;
  date: string;
  note?: string;
}

const MoodTracker = () => {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [averageMood, setAverageMood] = useState<number>(0);
  const [moodTrend, setMoodTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    const user = JSON.parse(currentUser);
    const allMoodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    
    // Filter user's mood entries and sort by date
    const userMoodHistory = allMoodHistory
      .filter((entry: MoodEntry) => entry.userId === user.email)
      .sort((a: MoodEntry, b: MoodEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate date range based on selected period
    const today = new Date();
    const periodStart = new Date();
    if (selectedPeriod === 'week') {
      periodStart.setDate(today.getDate() - 7);
    } else {
      periodStart.setMonth(today.getMonth() - 1);
    }

    // Filter mood entries within the selected period
    const filteredMoodHistory = userMoodHistory.filter((entry: MoodEntry) => 
      new Date(entry.date) >= periodStart && new Date(entry.date) <= today
    );

    setMoodData(filteredMoodHistory);

    // Calculate average mood
    if (filteredMoodHistory.length > 0) {
      const avg = filteredMoodHistory.reduce((sum, entry) => sum + entry.mood, 0) / filteredMoodHistory.length;
      setAverageMood(Number(avg.toFixed(1)));

      // Calculate mood trend
      const firstHalf = filteredMoodHistory.slice(filteredMoodHistory.length / 2);
      const secondHalf = filteredMoodHistory.slice(0, filteredMoodHistory.length / 2);
      const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
      
      if (Math.abs(firstAvg - secondAvg) < 0.5) {
        setMoodTrend('stable');
      } else {
        setMoodTrend(firstAvg > secondAvg ? 'up' : 'down');
      }
    }
  }, [navigate, selectedPeriod]);

  const getMoodColor = (mood: number): string => {
    if (mood <= 3) return 'bg-red-500';
    if (mood <= 7) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getAIMoodComment = () => {
    if (moodData.length === 0) return "Start tracking your mood to get personalized insights!";
    
    if (moodTrend === 'up') {
      return "Your mood has been improving! Keep up the positive momentum ^_^";
    } else if (moodTrend === 'down') {
      return "I notice you've been feeling down lately. Remember to take care of yourself ♥";
    } else {
      return "Your mood has been stable. Keep up the good work!";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Your Wellness Journey</h1>

          <div className="flex gap-2 mb-6">
            <Link to="/history" className="flex-1 bg-[#BAE6F2]/50 py-2 rounded-lg text-center">
              Conversations
            </Link>
            <button className="flex-1 bg-[#BAE6F2] py-2 rounded-lg relative text-center">
              Mood Tracker
              <Star className="w-5 h-5 text-green-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedPeriod('week')}
                className={`px-4 py-2 rounded-lg ${
                  selectedPeriod === 'week' ? 'bg-[#7CC5E3] text-white' : 'bg-gray-100'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-2 rounded-lg ${
                  selectedPeriod === 'month' ? 'bg-[#7CC5E3] text-white' : 'bg-gray-100'
                }`}
              >
                Last 30 Days
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Average Mood:</span>
              <span className="font-semibold">{averageMood}/10</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative h-64 border-b border-l border-gray-300 p-4">
              {/* Y-axis labels */}
              <div className="absolute -left-8 h-full flex flex-col justify-between">
                {[10, 8, 6, 4, 2, 0].map((value) => (
                  <span key={value} className="text-sm text-gray-500">
                    {value}
                  </span>
                ))}
              </div>

              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-t border-gray-200 w-full" />
                ))}
              </div>

              {/* Mood bars */}
              <div className="absolute inset-x-8 bottom-0 flex items-end justify-around h-full pt-4">
                {moodData.slice(0, 7).reverse().map((entry, index) => {
                  const height = `${(entry.mood / 10) * 100}%`;
                  const date = new Date(entry.date);
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1 mx-1">
                      <div className="w-full max-w-[40px] relative h-full">
                        <div 
                          className={`absolute bottom-0 w-full ${getMoodColor(entry.mood)} rounded-t-lg transition-all duration-500`}
                          style={{ height }}
                          title={`Mood: ${entry.mood}/10`}
                        />
                      </div>
                      <span className="text-xs mt-2 text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}

                {moodData.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No mood data available
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm">Low (1-3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-sm">Medium (4-7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm">High (8-10)</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6 text-[#7CC5E3]" />
              <h3 className="font-semibold">AI Generated Insight</h3>
            </div>
            <p className="text-gray-700">
              {getAIMoodComment()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;