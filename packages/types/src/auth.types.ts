export interface AuthPubSubResponse {
    url: string;
    token: string;
}

export interface SpeechToken {
  token: string
  region: string
}

export interface GenerateQuestionsResponse {
    processing: true;
    processId: string;
}