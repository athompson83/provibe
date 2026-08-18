export interface QuestionDependency {
  questionId: string;
  equals: string;
}

export interface BlueprintQuestion {
  id: string;
  priority: number;
  question: string;
  requiresAnswer?: QuestionDependency;
}

export type BlueprintAnswers = Record<string, string>;

export function selectNextQuestion(questions: BlueprintQuestion[], answers: BlueprintAnswers): BlueprintQuestion | undefined {
  return [...questions]
    .filter((question) => answers[question.id] === undefined)
    .filter((question) => {
      if (!question.requiresAnswer) return true;
      return answers[question.requiresAnswer.questionId] === question.requiresAnswer.equals;
    })
    .sort((a, b) => b.priority - a.priority)[0];
}
