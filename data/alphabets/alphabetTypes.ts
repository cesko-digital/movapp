export interface ExampleType {
  example: string;
  example_transcription: string;
}

export interface Letter {
  letter: [string, string | null];
  transcription: string;
  examples: [ExampleType, ExampleType, ExampleType];
}
