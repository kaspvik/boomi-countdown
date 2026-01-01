export const CIVILIAN_QUESTIONS: string[] = [
  "Roles are assigned — who do you think is the imposter?",
  "Who’s playing too safe right now?",
  "Who looks the most nervous?",
  "Who is trying a bit too hard to seem innocent?",
  "Who would you least trust with Boomi?",
  "Who has been unusually quiet this round?",
  "Who is most likely to be lying right now?",
  "If you had to accuse someone with no evidence, who would it be?",
  "Who is most likely to panic under pressure?",
  "Who is best at manipulating the room?",
  "Who is most likely to be an imposter and get away with it?",
  "Who would you most regret accusing if you were wrong?",
  "Who do you think is secretly enjoying the chaos?",
];

export function getCivilianQuestionForRound(round: number): string {
  if (CIVILIAN_QUESTIONS.length === 0) {
    return "Roles are assigned — who do you think is the imposter?";
  }
  return CIVILIAN_QUESTIONS[
    (round - 1 + CIVILIAN_QUESTIONS.length) % CIVILIAN_QUESTIONS.length
  ];
}

export const IMPOSTER_QUESTION =
  "Choose who should secretly receive Boomi this round.";
