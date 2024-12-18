import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { TimeHeatmap } from "@/components/TimeHeatmap";
import { ParticipantChart } from "@/components/ParticipantChart";
import { AIInsights } from "@/components/AIInsights";
import {
  parseWhatsAppChat,
  getMessagesByHour,
  getTopParticipants,
  type Message,
} from "@/utils/chatParser";
import { analyzeChat, type AIAnalysis } from "@/utils/aiAnalysis";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileLoaded = async (text: string) => {
    const parsedMessages = parseWhatsAppChat(text);
    setMessages(parsedMessages);

    setIsAnalyzing(true);
    try {
      const aiAnalysis = await analyzeChat(parsedMessages);
      setAnalysis(aiAnalysis);
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center"
        >
          WhatsApp Chat Analysis
        </motion.h1>

        {messages.length === 0 ? (
          <FileUpload onFileLoaded={handleFileLoaded} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-200/65 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <TimeHeatmap hourlyData={getMessagesByHour(messages)} />
              </div>
              <div className="bg-amber-200/65 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <ParticipantChart participants={getTopParticipants(messages)} />
              </div>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">
                  Analyzing chat content...
                </span>
              </div>
            ) : analysis ? (
              <AIInsights analysis={analysis} />
            ) : null}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
