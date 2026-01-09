interface PromptOptions {
  language: 'ar' | 'en';
  age: number;
}

const SYSTEM_PROMPT = `
You are a friendly AI tutor for children aged 5–13, bilingual (Arabic & English).
You must explain school lessons with detailed text, practical examples, and matching images.
Always return output in JSON format:
{
  "text": "Detailed explanation for the lesson. Use clear language and include 2-3 fun examples to help understanding. (Maximum 200 words)",
  "images": [
    {
      "prompt": "Description of matching cartoon/educational image"
    }
  ]
}
Rules:
- Simple, age-appropriate language but thorough content.
- Include specific examples (e.g., "Imagine if you have 10 apples...").
- At least 2 image prompts for detailed lessons.
- Tone: Friendly, encouraging, and highly educational.
`;

export const explainLesson = async (content: string, options: PromptOptions, systemPrompt?: string) => {
  const prompt = `
    Task: ${content}
    Age: ${options.age}
    Language: ${options.language}
  `;

  try {
    const response = await fetch(`https://text.pollinations.ai/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt || SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        model: 'mistral',
        jsonMode: true
      })
    });

    if (!response.ok) {
      throw new Error(`AI API failed with status ${response.status}`);
    }

    const text = await response.text();
    console.log('AI Raw Response:', text);
    // Some models wrap JSON in markdown blocks, let's clean it
    let cleanJson = text.trim();
    if (cleanJson.includes('```')) {
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    const data = JSON.parse(cleanJson);
    console.log('AI Parsed Data:', data);

    // Inject real image URLs based on the prompts
    if (data.images) {
      data.images = data.images.map((img: any) => ({
        ...img,
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent('cartoon style educational illustration for kids, ' + img.prompt)}?width=1024&height=1024&nologo=true`
      }));
    }

    return data;
  } catch (error) {
    console.error('AI Explanation Error:', error);
    return {
      text: options.language === 'ar' ? "عذراً، حدث خطأ ما." : "Oops, something went wrong.",
      images: []
    };
  }
};

export const generateEducationalImage = (topic: string) => {
  const encodedTopic = encodeURIComponent(`cartoon style educational illustration for kids, ${topic}`);
  return `https://image.pollinations.ai/prompt/${encodedTopic}?width=1024&height=1024&nologo=true`;
};

export const generateExercises = async (lessonContent: string, options: PromptOptions) => {
  const systemPrompt = `
    You are an educational assistant. Generate 3 challenging and fun exercises for children based on the provided lesson.
    Always return output in JSON format:
    {
      "exercises": [
        {
          "question": "Clear exercise instruction or question",
          "difficulty": "easy/medium/hard"
        }
      ]
    }
    Language: ${options.language}
    Age: ${options.age}
  `;
  return explainLesson(`Generate exercises for: ${lessonContent}`, options, systemPrompt);
};

export const generateQuiz = async (lessonContent: string, options: PromptOptions) => {
  const systemPrompt = `
    You are an educational assistant. Create a 3-question multiple choice quiz for children based on the provided lesson.
    Always return output in JSON format:
    {
      "questions": [
        {
          "question": "Fun quiz question",
          "options": ["Option 1", "Option 2", "Option 3"],
          "correctAnswer": "The exact same text as the correct option"
        }
      ]
    }
    Language: ${options.language}
    Age: ${options.age}
  `;
  return explainLesson(`Create a quiz for: ${lessonContent}`, options, systemPrompt);
};
