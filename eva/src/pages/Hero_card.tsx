import { motion } from "framer-motion";
import { Brain, LetterText, LoaderCircle, PenLine } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

const technologies = [
  {
    icon: PenLine,
    title: "Line Strokes",
    description: "Line Stroke is a simple and easy to use draw Letters",
    color: "group-hover:text-purple-500",
    delay: 0.2,
  },
  {
    icon: LoaderCircle,
    title: "Curves",
    description: "Curves is a simple and easy to use draw Letters",
    color: "group-hover:text-green-500",
    delay: 0.3,
  },
  {
    icon: LetterText,
    title: "Letters",
    description: "Letters are the building blocks for the Handwriting",
    color: "group-hover:text-yellow-500",
    delay: 0.4,
  },
  {
    icon: Brain,
    title: "AI Feedback",
    description: "AI Feedback is used to improve the Handwriting",
    color: "group-hover:text-pink-500",
    delay: 0.5,
  },
];

export default function Hero_card() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-poppins">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 pt-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <div className="text-center max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-20 mx-auto mt-12 mb-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tech.delay, duration: 0.5 }}
                  className="h-full cursor-pointer "
                >
                  <Card className="group hover:shadow-lg w-[27rem] transition-all duration-300 backdrop-blur-sm border-border    dark:hover:from-gray-800 dark:hover:to-gray-700 h-full flex flex-col">
                    <CardContent className="p-6 flex-grow flex flex-col justify-between">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <tech.icon
                          className={`w-12 h-12 transition-colors duration-300 ${tech.color}`}
                        />
                        <h3 className="text-xl font-semibold">{tech.title}</h3>
                        <p className="text-muted-foreground">
                          {tech.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty space before footer */}
      <div className="h-24"></div>

      {/* Background gradient effect */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background -z-10" />
      <div className="fixed inset-0 bg-grid-foreground/[0.02] -z-10" />
    </div>
  );
}
