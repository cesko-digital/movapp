export const resolveMethods: Record<string, (correctChoiceId: number, selectChoices: number[]) => boolean> = {
  // anySelected: (choices) => !!choices.find((choice) => choice.selected),
  oneCorrect: (correctChoiceId, selectedChoices) => selectedChoices.includes(correctChoiceId),
  // allCorrect: (choices) => choices.every((choice) => choice.selected && choice.correct),
};
