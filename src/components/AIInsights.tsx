import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Props {
  analysis: {
    themes: string[];
    patterns: string[];
    insights: string[];
  };
}

export function AIInsights({ analysis }: Props) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">AI Analysis</h2>

      <div className="space-y-4">
        <section>
          <h3 className="text-xl font-semibold mb-2">Main Themes</h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.themes.map((theme, i) => (
              <li key={i}>{theme}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Communication Patterns</h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.patterns.map((pattern, i) => (
              <li key={i}>{pattern}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">Key Insights</h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.insights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
