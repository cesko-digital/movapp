import { ExerciseResult } from '../exerciseStore';

export const resultMethods: Record<string, (correctChoiceId: number, selectedChoiceId: number[]) => ExerciseResult> = {
  selectedCorrect: (correctChoiceId, selectedChoiceIds) => ({
    // (Math.max(0,selected correct - selected wrong) / all correct) * 100
    score:
      100 *
      Math.max(
        0,
        selectedChoiceIds.filter((id) => correctChoiceId === id).length - selectedChoiceIds.filter((id) => correctChoiceId !== id).length
      ),
  }),
};
