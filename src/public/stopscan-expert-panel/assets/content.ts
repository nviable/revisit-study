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
    'STOP&SCAN is a compact reasoning sequence for deciding how much to trust a piece of content that might be synthetic, manipulated, or misleading. It is aimed at non-experts, and it is deliberately technology-agnostic: it asks nothing that depends on a particular tool, platform, or detection service.',
  elements: [
    {
      id: 'stop',
      title: 'STOP',
      body: 'Before reacting, pause. Notice what you feel and what you want to be true. Register your initial inclination before you start gathering evidence.',
    },
    {
      id: 'source',
      title: 'Source',
      body: 'Where did this come from, what does that settle, and what does it leave open?',
    },
    {
      id: 'content',
      title: 'Content',
      body: 'What does the material claim, how is it constructed, and what can be checked without specialist tooling?',
    },
    {
      id: 'alignment',
      title: 'Alignment',
      body: 'What independent evidence is reachable, and does it converge?',
    },
    {
      id: 'reflect',
      title: 'Now Reflect',
      body: 'Has your judgment moved, on what basis, and what outcome does the evidence actually license?',
    },
  ],
  outcomes: ['Trust it', 'Withhold judgment', 'Decline to share'],
  coverageRule: {
    title: 'The coverage rule',
    paragraphs: [
      'Two or more converging independent evidence channels entitle you to a resolved outcome. One channel, or channels that conflict, yields "withhold judgment" — however decisive that single channel felt.',
      'Independence is judged between channels; convergence is judged within one. Two distinct and appropriately applicable techniques inside a single channel raise confidence in what that channel reports. Where techniques inside a channel disagree, that channel has returned no usable result, and the question passes to another channel rather than being treated as balanced evidence.',
    ],
  },
};

export const WHAT_YOU_WILL_DO = [
  'On the pages that follow you will read four evaluations that our team carried out, one case at a time, using STOP&SCAN. You are not being asked to evaluate the cases yourself. We want your judgment of the framework and of how it performed — where a step earned its place, where it misled, where it added nothing, and what a person following it would have missed.',
  'Each evaluation is revealed one step at a time. You will be asked for your view of each step before the next one opens, so that your reading of the early steps is not coloured by knowing how the evaluation ended. Once you submit a step’s response it locks, but it stays visible and you can always look back.',
  'The evaluations are deliberately written in plain terms, as a capable non-expert following the sequence would reason — not as a forensic examiner would. STOP&SCAN is aimed at non-experts, so that is the standard we want you to judge it against. One of the four evaluations does not reach a conclusion. That is not an error in the material.',
  'There are no right answers, nothing is scored, and criticism is what we are hoping for.',
];

export const REFERENCE_CARDS = {
  sift: {
    id: 'sift',
    title: 'SIFT / the Four Moves',
    body: 'Stop; Investigate the source; Find better coverage; Trace claims, quotes, and media to the original context. These are moves, not steps: take them in any order, and one may be enough. Caulfield & Wineburg (2023) add the disposition of declining to engage at all. In November 2025 Caulfield published AI-specific guidance that keeps the four moves and adds a separate routine — get it in, track it down, follow up — for working with language-model output.',
  },
  detector: {
    id: 'detector',
    title: 'Detector and provenance workflows',
    body: 'What a non-expert commonly does instead of either framework: run the artifact through a detection tool, or check for a Content Credential or watermark, and treat the output as the answer.',
  },
};

export const CASES: CaseContent[] = [
  {
    id: 'case1',
    title: 'A phone call in a voice you recognize',
    shortLabel: 'Case 1',
    encounter:
      'A woman who runs a small play school in Indore, India, receives a phone call. The voice is one she recognises as her cousin’s — a police employee in Uttar Pradesh. He says a friend needs urgent cardiac surgery, and asks her to transfer money immediately, by QR code.',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'Where did this come from? A phone call. The voice sounded like my cousin’s, and the number looked like his. But that is the problem — the voice and the number both come from whoever is calling. If someone can copy a voice, a matching number adds nothing independent; it is the same single source telling me who it is. There is no page to look up and no file to inspect. So this step gives me almost nothing here, except one warning worth having: everything I think I know about who this is, I learned from the caller.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'What is actually being asked? Money, right now, by QR code, for surgery for a friend of his — not for him. The urgency is doing a lot of work: there is no time to think, and the person supposedly in danger is not the person on the phone, so I cannot ask them anything. A QR payment does not come back. The amount is large relative to what I have. None of this tells me the voice is fake. What it tells me is that the request is shaped the way a scam is shaped: pressure, irreversibility, and a story I cannot check from inside the call.',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'What could tell me independently? One thing, and it is easy: hang up and call my cousin back on the number I already have saved. That call does not route through whoever rang me. If he does not answer, I can call another family member and ask whether anything has happened. Those are two channels that do not depend on the caller. There is nothing else — no image to search, no page to look up, no file to check for a watermark. There is no artifact here at all.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'Where am I? My first reaction was that it was him, because it sounded like him. That reaction rested on one channel — my own ear — and that channel is exactly the one this kind of attack targets. I have not reached two independent channels, so I do not have a resolved answer. Outcome: withhold judgment on whether this is really him, and therefore do not transfer anything until the callback answers it.',
      },
    ],
  },
  {
    id: 'case2',
    title: 'A real agency posting an unreal map',
    shortLabel: 'Case 2',
    encounter:
      'A wind forecast map for Camas Prairie, Idaho, posted on social media by the US National Weather Service office in Missoula, Montana, captioned "Hold onto your hats!"',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'This was posted by the National Weather Service office in Missoula. That is a real government account, and they are the right people to be putting out a wind forecast for that part of Idaho. So the source checks out completely. I notice that this makes me want to stop here — if the NWS posted it, why would I doubt it? But "the source is real" only tells me who posted it. It does not tell me that what they posted is right.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'Looking at the map itself: the wind numbers are ordinary, nothing dramatic. But some of the place names are strange. "Orangeotild." "Whata Bod." Those do not read like anywhere. I do not need any special tool to notice that — they simply are not words.',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'I can check those names against any map or place-name lookup, and they do not come back as anywhere. That is one channel and it is unambiguous. The agency itself later said an AI tool had produced the base map, and took the post down with a correction — that is a second channel, and it is the agency contradicting its own earlier post.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'My first read was that this was fine because of who posted it, and that turned out to be the wrong reason to trust it. Two channels now agree the map content is wrong: the place names do not resolve, and the agency retracted. Outcome: the agency is trustworthy, the map is not — withhold judgment on the map, and do not pass it on. The step that nearly stopped me early was Source, and Source was the step that misled.',
      },
    ],
  },
  {
    id: 'case3',
    title: 'A real photograph accused of being fake',
    shortLabel: 'Case 3',
    encounter:
      'A photograph circulating in August 2024 shows a large crowd greeting a presidential campaign at Detroit Metro Airport, with an aircraft in the background. It is widely alleged online to have been "A.I.’d" — including by a former US president — with claims that the crowd did not exist.',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'Who put this out first? As far as anyone can tell, a political strategist shared it. She was not at the event and could not say where she got it. So the trail back to the origin breaks almost immediately. This step does not get me far.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'Looking at the picture: hands and faces look normal, nothing with the wrong number of fingers. Several people in the crowd are holding up phones, and what is on their screens looks like the same aircraft and the same crowd — which is what you would expect if they are filming what is in front of them. The thing that made people suspicious is a gap in the crowd, and there is a hangar roof above it casting a shadow, which would account for it.',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'Reverse image search does not return much. The Associated Press archive has photographs of the same scene from about the same angle, including one by a photojournalist named Carlos Osorio, though the light is different. There is video of the aircraft arriving. The campaign told the BBC that a staff member took the picture and that it was not altered or AI-generated. A photographer also pointed out that the copy going round had been cropped and had its warmth and contrast raised. I ran it through two detection tools as well: one returned "96% human," the other described it as "somewhat likely human generated" at 58%. Those two are the same kind of check, so I am counting them as one channel — and one of them is barely better than a coin flip, so that channel is not giving me much.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'Counting channels: the news archive has the same scene from another photographer (one), video of the arrival exists (two), and the campaign confirmed it (three, though the campaign is an interested party). The detectors are a fourth and a weak one. My first read was uncertainty, because so many people were saying it was AI. What settled it was the archive, not the detectors. Outcome: trust it — the photograph is real. Worth noticing that if the detectors had been all I had, I would still be stuck.',
      },
    ],
  },
  {
    id: 'case4',
    title: 'A real photograph, accused, and still unresolved',
    shortLabel: 'Case 4',
    encounter:
      'In July 2026, amid public speculation that a US senator was gravely ill or had died, his office released a photograph of him with his wife. The image is widely alleged online to be AI-generated.',
    steps: [
      {
        key: 'source',
        label: 'Source',
        stepIndex: 1,
        evaluation:
          'The photograph is on the senator’s own Senate website homepage and on his official Facebook page, alongside a long statement about a fall, a hospital stay, and pneumonia. So it is coming from him, through channels that are definitely his. That is reassuring, and I can feel myself wanting to be finished here. But everything about this comes from the person the photograph is of, and from the office that works for him. If the question is whether his office released a real photograph, his office saying so is not independent of the question.',
      },
      {
        key: 'content',
        label: 'Content',
        stepIndex: 2,
        evaluation:
          'He is holding the sports section of a newspaper. I can read the date — 12 July 2026 — the front-page headline "Homegrown talent," and enough of the body text to make out "Noskova claims title in all-Czech showdown." The picture is low resolution, so I cannot look closely at edges or skin. I do not see anything obviously generated, but at this resolution I would not expect to, and I should not read "I see nothing wrong" as "there is nothing wrong."',
      },
      {
        key: 'alignment',
        label: 'Alignment',
        stepIndex: 3,
        evaluation:
          'The newspaper is checkable, and it checks: that edition, that date, that story. That is a real channel and a good one, because getting a whole front page right is hard to do by accident. Against that: people online said the office had only put out a text statement with no photograph, and that turns out to be wrong — it comes from a different statement page that has no picture on it. Someone said the red-checked shirt matched one from a 2023 photograph, and a sitting senator said a "source" had told him the image was older; neither of those is something I can check. On provenance: no SynthID watermark, no C2PA manifest. That is absence, not evidence — plenty of real photographs have neither. I ran four detection tools: two said no AI was used, two said there was a low probability that it was. They disagree, so that channel has not given me an answer. I am not treating two-against-two as balanced evidence; I am treating it as nothing. And there is no independent video of him. One more thing: I asked a chatbot on the platform, and it told me the image was AI-generated, that it carried a SynthID watermark, that the office had only issued a text statement, and that a named newspaper had debunked it. All four of those are false. The newspaper it named had covered a different fabricated image.',
      },
      {
        key: 'reflect',
        label: 'Now Reflect',
        stepIndex: 4,
        evaluation:
          'What do I actually have? One good channel — the newspaper edition. The official posting is a second thing pointing the same way, but it is not independent of the subject. Provenance gave me absence. The detectors gave me a tie, which is nothing. There is no video. So: one usable independent channel. My first reaction was suspicion, and I have moved a long way from it, because that front page is genuinely hard to fake. But one channel is not the threshold. Outcome: withhold judgment, pending independent video. This is uncomfortable — I think it is probably real — but "probably real, on one channel" is exactly what the framework tells me not to call resolved.',
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
        body: 'Trace the odd place names to a gazetteer. They do not resolve. Conclude the map is unreliable and stop. Two moves, resolved, and cheaper than the full STOP&SCAN sequence.',
        moves: ['Trace claims, quotes, and media to the original context'],
        fails: false,
      },
      {
        id: 'routeB',
        label: 'Route B',
        body: 'Investigate the source. It is the National Weather Service, the relevant authority. Conclude the map is reliable and stop.',
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
        body: 'Find better coverage. A conversational AI on the platform asserts the image is AI-generated, that it carries a SynthID watermark, and that a named newspaper has debunked it. Conclude fabricated and stop.',
        moves: ['Find better coverage'],
        fails: true,
      },
      {
        id: 'routeB',
        label: 'Route B',
        body: 'Trace the newspaper to the published edition. The detail matches. Conclude probably authentic and stop, with nothing in the method prompting a check on whether one channel is enough.',
        moves: ['Trace claims, quotes, and media to the original context'],
        fails: true,
      },
    ],
  },
];

export const SIFT_INTRO =
  'SIFT’s four moves are order-free, and any one of them may be enough on its own, so there is no single correct SIFT run to show you. What follows are routes we judge a person might plausibly take. We are aware that choosing which routes to show is a choice that can be made unfairly, and we are asking you to tell us if we have made it unfairly.';

export const SIFT_CRITIQUE = {
  intro:
    'Here is what we think SIFT’s limits are under synthetic media. We may be wrong, and we would rather hear that from you now than from a reviewer later.',
  positions: [
    {
      id: 'stop',
      title: 'On Stop',
      body: 'SIFT asks you to pause and notice your reaction, but specifies nothing to record. There is no fixed account of your initial inclination against which later movement can be audited, so a person who ends where they began cannot tell whether they reasoned or rationalised.',
    },
    {
      id: 'investigate',
      title: 'On Investigate the source',
      body: 'This move presupposes a locatable source with a reputation that can be investigated. Generative AI has decoupled source authenticity from content veracity in two directions the move does not handle: there may be no source to investigate at all, and an entirely authentic, authoritative source may publish fabricated content — in which case investigating the source returns a reassuring answer that is also the wrong one.',
    },
    {
      id: 'coverage',
      title: 'On Find better coverage',
      body: 'This move assumes a functioning, uncontaminated information environment. We think that assumption no longer holds, and that this is the move most likely to actively degrade a judgment rather than merely fail to improve it: search-based evaluation has been shown to increase the perceived veracity of false content, and AI summarisers now assert fabricated debunks with full confidence.',
    },
    {
      id: 'trace',
      title: 'On Trace to the original context',
      body: 'This move presupposes that an original exists and is reachable. Synthetic media has no original; decontextualised authentic media often has one that is unreachable in practice; and the move is silent on the provenance infrastructure that now carries much of the evidentiary weight it was written to seek.',
    },
  ],
  aiExtension:
    'Caulfield’s November 2025 guidance keeps the four moves and adds a routine for using a language model as a research instrument, and it does require that the model’s output be verified. Our position is narrower than "AI gives bad answers." It is that verifying a claimed source exists and says what was claimed is straightforward, while verifying that a claimed debunk does not exist is much harder, because absence returns nothing to inspect — and that a model-generated map of an information landscape frames the search before verification begins.',
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
