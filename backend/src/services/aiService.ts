import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerateChatResponseInput {
  messages: ChatMessage[];
  systemPrompt: string;
  subject: string;
  level: string;
  temperature?: number;
  maxTokens?: number;
}

export const generateChatResponse = async (input: GenerateChatResponseInput): Promise<string> => {
  try {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: input.systemPrompt
      },
      ...input.messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: input.temperature || 0.7,
      max_tokens: input.maxTokens || 2000
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
};

export interface VideoScript {
  steps: Array<{
    action: 'write' | 'draw' | 'explain' | 'highlight';
    content: string;
    narration: string;
    duration: number; // seconds
  }>;
  summary: string;
}

export const generateVideoScript = async (
  question: string,
  systemPrompt: string,
  subject: string,
  level: string
): Promise<VideoScript> => {
  try {
    const prompt = `You are an expert ${subject} teacher for ${level} level students in Zimbabwe.

${systemPrompt}

A student asked: "${question}"

Generate a step-by-step video script for explaining this. The script should:
1. Break down the solution into clear steps
2. Include what to write/draw on a whiteboard for each step
3. Include narration text for each step
4. Be appropriate for ${level} level students
5. Follow Zimbabwean curriculum standards

Return a JSON object with this structure:
{
  "steps": [
    {
      "action": "write|draw|explain|highlight",
      "content": "What to show on the board",
      "narration": "What to say",
      "duration": 10
    }
  ],
  "summary": "A concise text summary of the explanation"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates structured video scripts for educational content. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    return JSON.parse(content) as VideoScript;
  } catch (error) {
    console.error('Video script generation error:', error);
    throw new Error('Failed to generate video script');
  }
};

export const generateLessonPlan = async (
  subject: string,
  level: string,
  topic: string,
  syllabusContent: any,
  instructorMaterials?: string[]
): Promise<any> => {
  const prompt = `Generate a comprehensive lesson plan for ${subject} (${level} level) on the topic: "${topic}".

Syllabus context: ${JSON.stringify(syllabusContent, null, 2)}

${instructorMaterials ? `Instructor materials available: ${instructorMaterials.join(', ')}` : ''}

Create a lesson plan with:
- Clear learning objectives
- Required resources
- Step-by-step activities
- Assessment suggestions
- Homework/extension activities

Return a structured JSON object with all these components.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert curriculum designer. Generate detailed, structured lesson plans.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

export const generateSchemeOfWork = async (
  subject: string,
  level: string,
  term: string,
  year: number,
  syllabusContent: any
): Promise<any> => {
  const prompt = `Generate a comprehensive scheme of work for ${subject} (${level} level) for ${term} term, ${year}.

Syllabus: ${JSON.stringify(syllabusContent, null, 2)}

Create a scheme of work with:
- Weekly breakdown
- Topics to cover each week
- Learning objectives per week
- Assessment points
- Resources needed

Return a structured JSON object.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert curriculum planner. Generate detailed schemes of work.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

export const generateAssessment = async (
  subject: string,
  level: string,
  topic: string,
  type: 'EXERCISE' | 'QUIZ' | 'EXAM',
  numQuestions: number = 10
): Promise<any> => {
  const prompt = `Generate a ${type.toLowerCase()} for ${subject} (${level} level) on the topic: "${topic}".

Create ${numQuestions} questions including:
- Multiple choice questions
- Short answer questions
- Problem-solving questions (if applicable)
- Structured questions

For each question, provide:
- The question text
- Question type
- Marks allocated
- Answer key
- Marking scheme

Return a structured JSON object with all questions and answers.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert assessment creator. Generate high-quality educational assessments.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

