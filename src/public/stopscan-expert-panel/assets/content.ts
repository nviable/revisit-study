/** Authored study content for STOP&SCAN expert panel. */

export interface CaseStepContent {
  key: 'source' | 'content' | 'alignment' | 'reflect';
  label: string;
  stepIndex: number;
  evaluation: string;
}

export interface CaseContent {
  id: string;
  title: string;
  shortLabel: string;
  encounter: string;
  steps: CaseStepContent[];
}

export const STOPSCAN_OVERVIEW = {
  intro:
    'STOP&SCAN is a five-step habit for deciding how much to trust something you see or hear online. It does not automatically tell you whether something is true or false. Instead, it helps you slow down, check what you can, and explain what supports your judgment.',
  elements: [
    {
      id: 'stop',
      title: 'STOP',
      body: 'Before reacting or searching, pause. What do you already believe about this? What are you feeling, and what are you hoping is true?',
    },
    {
      id: 'source',
      title: 'Source',
      body: 'Who posted or shared this? Is the source identifiable? What does knowing the source tell you, and what does it not tell you?',
    },
    {
      id: 'content',
      title: 'Content',
      body: 'What is the content asking you to believe, feel, or do? Is there anything in the content itself that you can check?',
    },
    {
      id: 'alignment',
      title: 'Alignment',
      body: 'Look for evidence that does not depend on the original source. Do other reliable sources point in the same direction?',
    },
    {
      id: 'reflect',
      title: 'Now Reflect',
      body: 'Think again about your first reaction. Has your judgment changed? If so, what changed it?',
    },
  ],
  orderExplanation: [
    'STOP and Now Reflect work as a pair. STOP captures your starting point. Now Reflect asks whether your judgment changed and why.',
    'Source and Content come before Alignment because they help determine what should be checked. Searching with only the original post’s wording can lead back to copies of the same claim rather than genuinely independent evidence.',
    'Although there are five steps, each step is meant to be a short question—not a specialist investigation. Sometimes a step will not provide useful information. That is still important to know.',
  ],
  outcomes: [
    {
      title: 'Trust',
      body: 'The evidence points toward the content being authentic, and two or more independent channels agree.',
    },
    {
      title: 'Decline to act or share',
      body: 'The evidence points toward the content being fabricated, and two or more independent channels agree. “Act” matters because the possible harm may be sending money, calling back, voting, or doing something else—not only sharing content.',
    },
    {
      title: 'Withhold judgment',
      body: 'Only one useful channel is available, or the channels conflict. This remains the outcome even when one signal feels very convincing.',
    },
  ],
  reporting:
    'Reporting is a separate judgment about possible harm to other people. It may accompany any of the three outcomes. For example, you may report something while still withholding judgment about whether it is authentic.',
  coverageRule: {
    title: 'How much evidence is enough?',
    paragraphs: [
      'STOP&SCAN first asks whether there is enough coverage, and then asks which direction the evidence points. A strong-feeling signal cannot create a resolved outcome on its own.',
      'The framework looks for at least two independent kinds of evidence that point in the same direction. “Independent” means that one source is not simply repeating or relying on the other. Several websites copying the same claim do not count as several independent channels.',
      'Multiple checks of the same type still count as one channel. For example, running an image through four AI-detection tools is one detector-based channel, not four separate channels. If those tools disagree, that channel is inconclusive.',
      'Channels are counted rather than completed steps because Source, Content, and Alignment may all rely on the same underlying evidence. Counting that evidence three times would make it seem stronger than it is.',
      'Withhold judgment is a complete outcome, not a temporary failure to decide. STOP&SCAN uses three states rather than asking people to assign a numerical confidence level.',
    ],
  },
};

export const WHAT_YOU_WILL_DO = [
  'You will review four real cases. For each case, we will show an example of how someone might use STOP&SCAN.',
  'You are not being asked to solve the cases yourself. Instead, we want you to review the example reasoning. Tell us which parts seem useful, which parts do not, and what the framework might have missed.',
  'Each case is shown one step at a time. This prevents the final outcome from influencing how you judge the earlier steps. After you submit your response to a step, you cannot edit it, but the step remains visible.',
  'The examples are meant to reflect how an ordinary internet user might think—not how a trained forensic investigator would work. One example ends without a definite answer. That is intentional.',
  'There are no correct responses. We are especially interested in criticism and disagreement.',
];

export const REFERENCE_CARDS = {
  sift: {
    id: 'sift',
    title: 'SIFT summary',
    body: 'SIFT is a flexible approach for checking online information. Its four moves are: Stop; Investigate the source; Find better coverage; and Trace claims, quotations, and media back to their original context. These are moves, not a required sequence. A person may use them in any order, and one move may sometimes be enough. Later guidance also discusses using language models as research tools while checking the sources and claims they provide.',
  },
  detector: {
    id: 'detector',
    title: 'Detection and provenance tools',
    body: 'Some people begin by using an AI-detection tool or looking for a watermark, Content Credential, or other provenance record. These checks may provide useful information, but they do not always give a clear answer. A missing watermark does not prove that something is fake, and different detection tools may disagree.',
  },
};

export const CASES: CaseContent[] = [
  {
    id: 'case1',
    title: 'An urgent phone call',
    shortLabel: 'Case 1',
    encounter:
      'A woman who runs a small play school in Indore, India, receives a phone call. The caller sounds like her cousin, who works for the police in another state. He says that a friend needs urgent heart surgery and asks her to send money immediately using a QR code.',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'The voice sounds familiar, and the number appears to be her cousin’s. That may feel reassuring, but both pieces of information come from the incoming call. If someone can copy a voice or disguise a phone number, neither one confirms who is calling.\n\nThere is no account, article, or file to inspect. The main thing this step reveals is that everything she currently knows about the caller comes from the caller himself.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'The caller is asking for money immediately. He says the emergency involves a friend, not himself, so the woman cannot ask the supposed patient any questions. The QR payment may also be difficult to recover once it is sent.\n\nNone of this proves that the voice is fake. It does show several warning signs: urgency, pressure, a payment that may not be reversible, and a story that cannot be checked while staying on the call.',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'The simplest check is to hang up and call her cousin using the number already saved in her phone. That call would not depend on the person who contacted her.\n\nIf her cousin does not answer, she could contact another family member. There is no image, recording, or webpage to search in this case. The useful check is reaching the person through a separate route.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'At first, the familiar voice made the call seem believable. But the voice is also the part that could have been copied.\n\nThere is not yet enough information to know who called. The outcome is Withhold judgment. She should not send money while the request remains unconfirmed.',
      },
    ],
  },
  {
    id: 'case2',
    title: 'A wind forecast map',
    shortLabel: 'Case 2',
    encounter:
      'The US National Weather Service office in Missoula posts a wind forecast map for Camas Prairie, Idaho, on social media. The caption says, “Hold onto your hats!”',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'The post comes from the real National Weather Service account for that region. That makes it easy to trust the map immediately.\n\nHowever, confirming who posted something does not confirm that every detail in the post is correct. A reliable organization can still make a mistake.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'Most of the wind figures look ordinary, but some of the place names look unusual. Names such as “Orangeotild” and “Whata Bod” do not look like real locations.\n\nA person does not need a specialist tool to notice this. The names can be checked using an ordinary map.',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'Searching for the unusual place names on a map does not return any matching locations.\n\nThe National Weather Service later said that an AI tool had been used to create the base map. It removed the original post and published a correction. The map check and the agency’s correction point in the same direction.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'At first, the official account made the map seem trustworthy. The place-name check and the agency’s correction show that the map itself is not reliable.\n\nTwo independent channels point toward fabricated details. The outcome is Decline to act or share. The organization may still be trustworthy, but this particular map should not be relied on or passed along.',
      },
    ],
  },
  {
    id: 'case3',
    title: 'A photograph of a campaign crowd',
    shortLabel: 'Case 3',
    encounter:
      'A photograph shared in August 2024 shows a large crowd greeting a presidential campaign at Detroit Metro Airport. An aircraft is visible behind the crowd. People online claim that the image was created or altered using AI and that the crowd was not really there.',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'The earliest person identified as having shared the photograph was a political strategist. She was not at the event and could not say where she received the image.\n\nThe trail back to the original photographer therefore stops early. This step does not provide much help.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'Nothing in the photograph is obviously impossible. Faces and hands look normal. Several people are holding up phones, and their screens appear to show the same crowd and aircraft.\n\nSome people pointed to a gap in the crowd as evidence of editing. A roof above that area casts a shadow, which could explain why the gap looks unusual. These observations do not prove that the photograph is real, but they give ordinary explanations for some of the suspicious details.',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'A reverse-image search does not provide much useful information. However, the Associated Press archive contains photographs of the same scene taken by another photographer. Video of the aircraft arriving also exists.\n\nThe campaign told the BBC that a staff member took the photograph and that it was not AI-generated. A photographer noted that the version being shared online had been cropped and had stronger colour and contrast.\n\nTwo AI-detection tools were also tried. Both leaned toward the image being human-made, but one result was only slightly more confident than chance. Because both tools are the same kind of check, they provide one weak channel rather than two independent sources.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'The strongest evidence is not the detector output. It is the other photographs and video showing the same scene.\n\nTwo or more independent channels point toward authentic. The outcome is Trust. If the detector results were the only evidence available, there would not be enough information to reach that conclusion.',
      },
    ],
  },
  {
    id: 'case4',
    title: 'A photograph shared by a senator’s office',
    shortLabel: 'Case 4',
    encounter:
      'In July 2026, people were speculating online that a US senator was seriously ill or had died. His office then released a photograph of him with his wife. Some people claimed that the photograph was AI-generated.',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'The photograph appears on the senator’s official Senate website and Facebook page, together with a statement about a fall, a hospital stay, and pneumonia.\n\nThese are genuine official accounts, which makes the photograph seem reassuring. However, the question is whether the office released an authentic photograph. The office’s own statement cannot independently confirm that.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'The senator is holding the sports section of a newspaper dated 12 July 2026. The headline and part of an article can be read in the photograph.\n\nThe image is low resolution, so small details such as skin, edges, or possible editing are difficult to inspect. Nothing looks obviously generated, but “I cannot see anything wrong” is not the same as “nothing is wrong.”',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'The newspaper is something that can be checked. The date, headline, and article shown in the photograph match the published edition. This supports the photograph, although it is only one kind of evidence.\n\nSeveral other online claims do not hold up. One claim said the senator’s office had released only a written statement, but that claim referred to a different webpage. Other claims about an older shirt and an unnamed source could not be verified.\n\nNo SynthID watermark or C2PA record was found. That does not prove anything by itself because many authentic photographs contain neither.\n\nFour AI-detection tools were also tried. Two leaned one way and two leaned the other. Because these tools are all the same type of check and do not agree, their results are inconclusive.\n\nA chatbot also made several confident claims about the image, but those claims were false or referred to a different photograph. No independent video of the senator was available.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'The newspaper provides one useful piece of independent evidence. The official post also supports authenticity, but it comes from the senator’s own office and is not independent of the subject.\n\nThe provenance checks provide no answer, the detection tools disagree, and there is no independent video. The photograph may be real, but only one useful independent channel is available.\n\nThe outcome is Withhold judgment until another independent source becomes available.',
      },
    ],
  },
];

export interface SiftRoute {
  id: string;
  label: string;
  body: string;
  moves: string[];
  fails: boolean;
}

export interface SiftCaseBlock {
  caseId: string;
  title: string;
  encounter: string;
  routes: SiftRoute[];
}

export const SIFT_BLOCKS: SiftCaseBlock[] = [
  {
    caseId: 'case2',
    title: 'Case 2 — the wind map',
    encounter: CASES[1].encounter,
    routes: [
      {
        id: 'routeA',
        label: 'Route A',
        body: 'The person notices the unusual place names and looks them up on a map. The names do not match real locations, so they decide that the forecast map is unreliable and stop. This reaches the answer more quickly than completing every STOP&SCAN step.',
        moves: ['Trace claims, quotes, and media to the original context'],
        fails: false,
      },
      {
        id: 'routeB',
        label: 'Route B',
        body: 'The person checks the account that posted the map. It is the real National Weather Service office responsible for that region. They decide that the map is reliable and stop without checking the place names.',
        moves: ['Investigate the source'],
        fails: true,
      },
    ],
  },
  {
    caseId: 'case4',
    title: 'Case 4 — the senator’s photograph',
    encounter: CASES[3].encounter,
    routes: [
      {
        id: 'routeA',
        label: 'Route A',
        body: 'The person looks for other coverage. A chatbot says the image is AI-generated, contains a SynthID watermark, and has been disproved by a newspaper. They accept that summary and decide that the photograph is fake. The chatbot’s claims are incorrect or refer to another image.',
        moves: ['Find better coverage'],
        fails: true,
      },
      {
        id: 'routeB',
        label: 'Route B',
        body: 'The person checks the newspaper shown in the photograph. The date, headline, and article match the published edition. They decide that the photograph is probably authentic and stop. This route finds useful evidence, but SIFT does not specify how many independent sources are needed before reaching a conclusion.',
        moves: ['Trace claims, quotes, and media to the original context'],
        fails: true,
      },
    ],
  },
];

export const SIFT_INTRO =
  'SIFT does not require people to follow its moves in a fixed order. A person may use only the moves that seem useful and may stop after one move if they believe they have enough information. The routes below are examples written for this study. They are not the only ways someone could use SIFT. Please tell us if a route seems unrealistic or unfair.';

export const SIFT_CRITIQUE = {
  intro:
    'Below are four concerns about using SIFT with synthetic media. Please tell us where you agree, where a concern is overstated, and where it is wrong.',
  positions: [
    {
      id: 'stop',
      title: 'On Stop',
      body: 'SIFT asks people to pause and notice their reaction, but it does not ask them to record their starting judgment. Without a clear starting point, it may be difficult to tell whether later evidence changed someone’s mind or whether they mainly found support for what they already believed.',
    },
    {
      id: 'investigate',
      title: 'On Investigate the source',
      body: 'This move works best when there is a source that can be identified and researched. Some synthetic content has no clear original source. In other cases, a genuine and trustworthy organization may publish incorrect or AI-generated content. Confirming the source may then provide false reassurance.',
    },
    {
      id: 'coverage',
      title: 'On Find better coverage',
      body: 'Searching for other coverage assumes that the search environment contains reliable information. Search results, copied claims, and AI-generated summaries may repeat or strengthen false information. Looking elsewhere can therefore sometimes make a judgment worse rather than better.',
    },
    {
      id: 'trace',
      title: 'On Trace to the original context',
      body: 'Some synthetic media has no authentic original to find. Authentic media may also have an original that is difficult or impossible to reach. This move does not directly address newer provenance systems such as Content Credentials or watermarks.',
    },
  ],
  aiExtension:
    'Newer SIFT guidance discusses using language models as research tools and checking the sources they provide. Our concern is that checking whether a cited source exists is easier than checking whether a claimed article or debunk does not exist. A language model may also shape the direction of a search before the user begins checking its claims.',
};

export const DEBRIEF = {
  thankYou: 'Thank you. Your responses are recorded and cannot be edited.',
  resolutions: [
    'Case 1 and Case 2 are as recorded in the AI Incident Database.',
    'Case 3 was rated True by Snopes — the photograph is authentic.',
    'Case 4 was left unrated by the fact-checkers, pending video footage, and remains unresolved.',
  ],
  notes: [
    'The evaluations you read were written by our research team as demonstrations of the framework. They are not authoritative analyses of these incidents, and they are published alongside this study so that readers can judge whether they were fair.',
    'The positions we stated about SIFT are our arguments, and they are contested. Nothing you said was scored, and no individual’s responses will be reported.',
  ],
  contacts: {
    pi: 'Saniat Javid Sohrawardi, Principal Investigator — john.sohrawardi@rit.edu',
    hsro: 'RIT Human Subjects Research Office — hsro@rit.edu — 585-475-7673',
  },
};

export function getCase(caseId: string): CaseContent {
  const found = CASES.find((c) => c.id === caseId);
  if (!found) {
    throw new Error(`Unknown case id: ${caseId}`);
  }
  return found;
}

export function getStep(caseId: string, stepKey: string): CaseStepContent {
  const caseContent = getCase(caseId);
  const step = caseContent.steps.find((s) => s.key === stepKey);
  if (!step) {
    throw new Error(`Unknown step ${stepKey} for ${caseId}`);
  }
  return step;
}
