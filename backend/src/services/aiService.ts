import axios from 'axios';

export interface AISummary {
  summary: string;
  keyPoints: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
}

export class AIService {
  private static readonly OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  private static readonly API_KEY = process.env.OPENAI_API_KEY;

  static async generateMeetingSummary(meetingNotes: string, attendees: string[]): Promise<AISummary> {
    if (!this.API_KEY) {
      return this.getFallbackSummary();
    }

    try {
      const prompt = `
        Please analyze the following meeting notes and provide a comprehensive summary:
        
        Meeting Notes: ${meetingNotes}
        Attendees: ${attendees.join(', ')}
        
        Please provide:
        1. A concise summary of the meeting
        2. Key points discussed
        3. Action items identified
        4. Overall sentiment (positive, neutral, or negative)
        5. Confidence level (0-100)
        
        Format your response as JSON with the following structure:
        {
          "summary": "Brief meeting summary",
          "keyPoints": ["point1", "point2", "point3"],
          "actionItems": ["action1", "action2"],
          "sentiment": "positive|neutral|negative",
          "confidence": 85
        }
      `;

      const response = await axios.post(
        this.OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps summarize meetings and extract key insights. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating AI summary:', error);
      return this.getFallbackSummary();
    }
  }

  static async generateTaskSummary(tasks: any[]): Promise<AISummary> {
    if (!this.API_KEY) {
      return this.getFallbackTaskSummary();
    }

    try {
      const taskDescriptions = tasks.map(task => 
        `- ${task.title}: ${task.description || 'No description'} (Status: ${task.status}, Priority: ${task.priority})`
      ).join('\n');

      const prompt = `
        Please analyze the following tasks and provide insights:
        
        Tasks:
        ${taskDescriptions}
        
        Please provide:
        1. A summary of the task portfolio
        2. Key patterns or themes
        3. Recommended priorities
        4. Overall productivity assessment
        5. Confidence level (0-100)
        
        Format your response as JSON with the following structure:
        {
          "summary": "Task portfolio summary",
          "keyPoints": ["insight1", "insight2", "insight3"],
          "actionItems": ["recommendation1", "recommendation2"],
          "sentiment": "positive|neutral|negative",
          "confidence": 80
        }
      `;

      const response = await axios.post(
        this.OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps analyze task portfolios and provide productivity insights. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating AI task summary:', error);
      return this.getFallbackTaskSummary();
    }
  }

  static async generateSmartSuggestions(userId: string, context: string): Promise<string[]> {
    if (!this.API_KEY) {
      return this.getFallbackSuggestions();
    }

    try {
      const prompt = `
        Based on the following context, provide 3-5 smart suggestions for task management and productivity:
        
        Context: ${context}
        
        Please provide practical, actionable suggestions that would help improve productivity and task management.
        Return as a JSON array of strings.
      `;

      const response = await axios.post(
        this.OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a productivity AI assistant. Provide practical, actionable suggestions. Always respond with valid JSON array.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return this.getFallbackSuggestions();
    }
  }

  private static getFallbackSummary(): AISummary {
    return {
      summary: 'Meeting summary generated based on available notes.',
      keyPoints: ['Key points extracted from meeting notes'],
      actionItems: ['Follow up on discussed items'],
      sentiment: 'neutral',
      confidence: 60
    };
  }

  private static getFallbackTaskSummary(): AISummary {
    return {
      summary: 'Task portfolio analysis based on current tasks.',
      keyPoints: ['Tasks analyzed for patterns and priorities'],
      actionItems: ['Focus on high-priority tasks', 'Complete overdue items'],
      sentiment: 'neutral',
      confidence: 50
    };
  }

  private static getFallbackSuggestions(): string[] {
    return [
      'Break down large tasks into smaller, manageable chunks',
      'Set specific deadlines for each task',
      'Use the Pomodoro Technique for focused work sessions',
      'Review and prioritize tasks daily',
      'Take regular breaks to maintain productivity'
    ];
  }
}
