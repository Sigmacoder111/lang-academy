import type { WritingEvaluation } from "../types/tasks";

interface EvaluateWritingParams {
  taskType: "story_narration" | "email_response";
  prompt: string;
  promptChinese: string;
  studentText: string;
  modelResponse: string;
  rubricFocus: string[];
}

function getApiKey(): string {
  const key = localStorage.getItem("anthropic-api-key");
  if (!key) {
    throw new Error(
      "No Anthropic API key found. Please set your API key to enable AI writing evaluation."
    );
  }
  return key;
}

export async function evaluateWriting(params: EvaluateWritingParams): Promise<WritingEvaluation> {
  const apiKey = getApiKey();
  const { taskType, prompt, promptChinese, studentText, modelResponse, rubricFocus } = params;

  const taskLabel = taskType === "story_narration" ? "Story Narration" : "Email Response";

  const systemPrompt = `You are an AP Chinese exam grader with expertise in evaluating student writing against the College Board AP Chinese rubric. You provide detailed, constructive feedback in English to help students improve their Chinese writing skills. Always return valid JSON.`;

  const userPrompt = `Evaluate this AP Chinese ${taskLabel} response.

**Task type:** ${taskLabel}
**Prompt (English):** ${prompt}
**Prompt (Chinese):** ${promptChinese}
**Rubric focus areas:** ${rubricFocus.join(", ")}
**Reference model response:** ${modelResponse}

**Student's response:**
${studentText}

Evaluate against the AP Chinese rubric on three dimensions (each scored 0-6):

1. **Task Completion (0-6):** Did they address all parts of the task? Is the response relevant and complete?
2. **Delivery/Organization (0-6):** Is it well-organized and coherent? Does it flow logically?
3. **Language Use (0-6):** Vocabulary range, grammar accuracy, sentence variety, appropriate register

Return a JSON object with exactly this structure (no markdown, no code fences, just raw JSON):
{
  "scores": {
    "taskCompletion": <number 0-6>,
    "organization": <number 0-6>,
    "languageUse": <number 0-6>
  },
  "overallScore": <number 0-6, weighted average>,
  "feedback": "<2-3 sentence overall assessment in English>",
  "corrections": [
    {
      "original": "<exact text from student response that has an error>",
      "corrected": "<corrected Chinese text>",
      "explanation": "<brief explanation in English>"
    }
  ],
  "vocabularySuggestions": ["<Chinese word or phrase the student could have used>"],
  "grammarIssues": ["<specific grammar pattern issue described in English>"],
  "modelResponse": "<an ideal response in Chinese for this prompt, can differ from reference>"
}

Important:
- Keep corrections to the most significant 3-5 errors
- Vocabulary suggestions should be 3-6 useful words/phrases
- Grammar issues should be 2-4 specific patterns
- Be encouraging but honest in feedback
- The modelResponse should be a high-quality response in Chinese`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your Anthropic API key and try again.");
    }
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error(`API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error("No response content from the API.");
  }

  try {
    const cleaned = content
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed = JSON.parse(cleaned) as WritingEvaluation;

    return {
      scores: {
        taskCompletion: clampScore(parsed.scores?.taskCompletion ?? 3),
        organization: clampScore(parsed.scores?.organization ?? 3),
        languageUse: clampScore(parsed.scores?.languageUse ?? 3),
      },
      overallScore: clampScore(parsed.overallScore ?? 3),
      feedback: parsed.feedback || "No feedback available.",
      corrections: Array.isArray(parsed.corrections) ? parsed.corrections.slice(0, 5) : [],
      vocabularySuggestions: Array.isArray(parsed.vocabularySuggestions) ? parsed.vocabularySuggestions.slice(0, 6) : [],
      grammarIssues: Array.isArray(parsed.grammarIssues) ? parsed.grammarIssues.slice(0, 4) : [],
      modelResponse: parsed.modelResponse || params.modelResponse,
    };
  } catch {
    throw new Error("Failed to parse evaluation response. The AI returned an invalid format.");
  }
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(6, Math.round(score)));
}
