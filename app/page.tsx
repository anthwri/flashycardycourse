import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  Zap,
  Plus,
  Play,
  BarChart3,
  Trophy
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <SignedIn>
        <WelcomeSection />
      </SignedIn>
      
      <SignedOut>
        <GuestWelcomeSection />
      </SignedOut>

      {/* Main Dashboard Content */}
      <SignedIn>
        <DashboardContent />
      </SignedIn>
    </div>
  );
}

function WelcomeSection() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back to your learning journey! 🎯
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Ready to continue mastering your flashcard courses?
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Continue Studying
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              New Deck
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GuestWelcomeSection() {
  return (
    <Card className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20">
      <CardContent className="p-8 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Master Any Subject with Flashcards 📚
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create, study, and track your progress with our intelligent flashcard system. 
            Sign in to get started on your learning journey!
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Study Streak" 
          value="7 days" 
          icon={<TrendingUp className="h-4 w-4" />}
          trend="+2 from last week"
        />
        <StatsCard 
          title="Cards Mastered" 
          value="234" 
          icon={<Brain className="h-4 w-4" />}
          trend="+12 this week"
        />
        <StatsCard 
          title="Study Time" 
          value="2h 15m" 
          icon={<Clock className="h-4 w-4" />}
          trend="Today"
        />
        <StatsCard 
          title="Accuracy" 
          value="87%" 
          icon={<Target className="h-4 w-4" />}
          trend="+5% improvement"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" className="gap-2">
            <BookOpen className="h-4 w-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <CoursesSection />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <ProgressSection />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <AchievementsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend: string; 
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
}

function CoursesSection() {
  const courses = [
    {
      title: "Spanish Vocabulary",
      progress: 75,
      cardsTotal: 120,
      cardsCompleted: 90,
      difficulty: "Intermediate",
      lastStudied: "2 hours ago"
    },
    {
      title: "React Fundamentals",
      progress: 45,
      cardsTotal: 80,
      cardsCompleted: 36,
      difficulty: "Beginner",
      lastStudied: "Yesterday"
    },
    {
      title: "Medical Terminology",
      progress: 90,
      cardsTotal: 200,
      cardsCompleted: 180,
      difficulty: "Advanced",
      lastStudied: "3 hours ago"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard key={index} course={course} />
      ))}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="flex items-center justify-center h-full p-6 text-center">
          <div className="space-y-3">
            <Plus className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-medium">Create New Course</h3>
              <p className="text-sm text-muted-foreground">Start a new flashcard deck</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{course.title}</CardTitle>
          <Badge className={getDifficultyColor(course.difficulty)} variant="secondary">
            {course.difficulty}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{course.cardsCompleted}/{course.cardsTotal} cards</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last studied {course.lastStudied}</span>
          <Button size="sm" className="gap-1">
            <Zap className="h-3 w-3" />
            Study
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Monday</span>
              <span>45 cards</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Tuesday</span>
              <span>62 cards</span>
            </div>
            <Progress value={90} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Wednesday</span>
              <span>38 cards</span>
            </div>
            <Progress value={60} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Study Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Best performance</p>
              <p className="text-xs text-muted-foreground">Tuesday mornings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Retention rate</p>
              <p className="text-xs text-muted-foreground">87% average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AchievementsSection() {
  const achievements = [
    { title: "First Steps", description: "Complete your first flashcard", unlocked: true },
    { title: "Week Warrior", description: "Study for 7 consecutive days", unlocked: true },
    { title: "Speed Demon", description: "Answer 50 cards in under 5 minutes", unlocked: false },
    { title: "Master Mind", description: "Achieve 95% accuracy on a deck", unlocked: false },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {achievements.map((achievement, index) => (
        <Card key={index} className={achievement.unlocked ? "border-yellow-200 dark:border-yellow-800" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                achievement.unlocked 
                  ? "bg-yellow-100 dark:bg-yellow-900/20" 
                  : "bg-gray-100 dark:bg-gray-800"
              }`}>
                <Trophy className={`h-4 w-4 ${
                  achievement.unlocked 
                    ? "text-yellow-600 dark:text-yellow-400" 
                    : "text-gray-400"
                }`} />
              </div>
              <div>
                <CardTitle className="text-sm">{achievement.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
