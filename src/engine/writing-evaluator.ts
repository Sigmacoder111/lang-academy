import type { WritingEvaluation } from "../types/writing";
import type { WritingPrompt } from "../types/writing";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function evaluateWriting(
  prompt: WritingPrompt,
  studentText: string,
  apiKey: string
): Promise<WritingEvaluation> {
  const taskType = prompt.format === "story_narration" ? "Story Narration" : "Email Response";

  const systemPrompt =
    "You are an AP Chinese exam grader. Evaluate student writing against the AP rubric. " +
    "You must return valid JSON only, with no markdown formatting or extra text. " +
    "Be encouraging but honest. Provide specific, actionable feedback.";

  const userPrompt = `Task type: ${taskType}
Prompt: ${prompt.prompt}
Student response: ${studentText}

Evaluate against the AP Chinese rubric:
1. Task Completion (0-6): Did they address all parts of the task?
2. Delivery/Organization (0-6): Is it well-organized and coherent?
3. Language Use (0-6): Vocabulary range, grammar accuracy, sentence variety

Return a JSON object with this exact structure:
{
  "scores": { "taskCompletion": <number 0-6>, "organization": <number 0-6>, "languageUse": <number 0-6> },
  "overallScore": <number 0-6, weighted average>,
  "feedback": "<overall feedback paragraph in English>",
  "corrections": [{ "original": "<text from student>", "corrected": "<corrected version>", "explanation": "<why in English>" }],
  "vocabularySuggestions": ["<word/phrase they could have used>"],
  "grammarIssues": ["<specific grammar pattern to work on>"],
  "modelResponse": "<an ideal response in Chinese for this prompt>"
}`;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) {
      throw new Error("No content in API response");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON from API response");
    }

    const evaluation: WritingEvaluation = JSON.parse(jsonMatch[0]);

    evaluation.scores.taskCompletion = clampScore(evaluation.scores.taskCompletion);
    evaluation.scores.organization = clampScore(evaluation.scores.organization);
    evaluation.scores.languageUse = clampScore(evaluation.scores.languageUse);
    evaluation.overallScore = clampScore(evaluation.overallScore);

    return evaluation;
  } catch (error) {
    console.error("Writing evaluation error:", error);
    throw error;
  }
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(6, Math.round(score * 10) / 10));
}

export function generateLocalEvaluation(
  prompt: WritingPrompt,
  studentText: string
): WritingEvaluation {
  const charCount = studentText.length;
  const { min, max } = prompt.expectedCharacters;
  const lengthRatio = Math.min(1, charCount / min);

  const hasPunctuation = /[。！？，、；：]/.test(studentText);
  const sentenceCount = (studentText.match(/[。！？]/g) || []).length;
  const hasVariety = sentenceCount >= 3;
  const hasParagraphs = studentText.includes("\n");

  let taskScore = Math.round(lengthRatio * 4 + (charCount >= min ? 1 : 0) + (charCount >= max * 0.8 ? 1 : 0));
  let orgScore = (hasPunctuation ? 2 : 0) + (hasVariety ? 2 : 0) + (hasParagraphs ? 2 : 0);
  let langScore = Math.min(6, Math.round(lengthRatio * 3 + (hasVariety ? 2 : 0) + (hasPunctuation ? 1 : 0)));

  taskScore = Math.min(6, Math.max(0, taskScore));
  orgScore = Math.min(6, Math.max(0, orgScore));
  langScore = Math.min(6, Math.max(0, langScore));

  const overallScore = Math.round(((taskScore + orgScore + langScore) / 3) * 10) / 10;

  return {
    scores: {
      taskCompletion: taskScore,
      organization: orgScore,
      languageUse: langScore,
    },
    overallScore: Math.min(6, overallScore),
    feedback:
      charCount < min
        ? `Your response is shorter than expected (${charCount}/${min} characters). Try to write more to fully address the prompt. ${hasPunctuation ? "Good use of punctuation!" : "Remember to use Chinese punctuation marks."}`
        : `Good effort! Your response is ${charCount} characters. ${hasVariety ? "Nice sentence variety." : "Try to vary your sentence structures more."} ${hasParagraphs ? "Good paragraph organization." : "Consider breaking your response into paragraphs."}`,
    corrections: [],
    vocabularySuggestions: [
      "Try using more connecting words (因此, 然而, 此外)",
      "Include time expressions (首先, 然后, 最后)",
    ],
    grammarIssues: charCount < 50
      ? ["Response is too short to evaluate grammar patterns"]
      : [
          "Review sentence-final particle usage (了, 过, 着)",
          "Practice using complement structures (得 + adjective)",
        ],
    modelResponse: prompt.modelResponse,
  };
}

const API_KEY_STORAGE_KEY = "lang-academy-anthropic-key";

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function loadApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
}
