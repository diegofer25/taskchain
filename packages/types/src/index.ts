export enum JobStatus {
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    ERROR = "error",
    CANCELLED = "cancelled"
}

export type JobStatusDto = FeedbackJobStatusDto | ErrorJobStatusDto;

interface BaseJobStatusDto {
    jobId: string;
    status: JobStatus;
}

interface FeedbackJobStatusDto extends BaseJobStatusDto {
    feedbackId: string;
}

interface ErrorJobStatusDto extends BaseJobStatusDto {
    error: string;
}

export interface AuthPubSubResponse {
    url: string;
    token: string;
}

export interface SpeechToken {
  token: string
  region: string
}
