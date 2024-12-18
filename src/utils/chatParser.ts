export interface Message {
  timestamp: Date;
  sender: string;
  content: string;
}

export const parseWhatsAppChat = (text: string): Message[] => {
  const lines = text.split('\n');
  const messages: Message[] = [];
  const messageRegex = /\[(.*?)\] (.*?): (.*)/;

  lines.forEach(line => {
    const match = line.match(messageRegex);
    if (match) {
      const [, timestamp, sender, content] = match;
      messages.push({
        timestamp: new Date(timestamp),
        sender,
        content,
      });
    }
  });

  return messages;
};

export const getMessagesByHour = (messages: Message[]): number[] => {
  const hourCounts = new Array(24).fill(0);
  messages.forEach(msg => {
    const hour = msg.timestamp.getHours();
    hourCounts[hour]++;
  });
  return hourCounts;
};

export const getTopParticipants = (messages: Message[], limit = 5): { name: string; count: number }[] => {
  const counts = new Map<string, number>();
  messages.forEach(msg => {
    counts.set(msg.sender, (counts.get(msg.sender) || 0) + 1);
  });
  
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
};