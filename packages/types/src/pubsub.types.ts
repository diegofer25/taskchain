export type PubSubEvent =
  | ProgressEventDetails<'creating-questions'>
  | ProgressEventDetails<'structuring-questions'>
  | QuestionsEvent
  | ErrorEvent;

type ProgressStep = 'creating-questions' | 'structuring-questions';

interface ProgressEventDetails<S extends ProgressStep> {
  kind: 'progress';
  step: S;
  processId: string;
  percent?: number;
}

interface QuestionsEvent {
  kind: 'result';
  processId: string;
  questionsResult: {
    context: string;
    questions: QuestionItem[];
  }
  context: string;
}

interface ErrorEvent {
  kind: 'error';
  processId: string;
  message: string;
}

interface QuestionItem {
  id: string;
  text: string;
}
