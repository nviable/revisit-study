#!/usr/bin/env python3
"""Generates public/stopscan-expert-panel/config.json for the STOP&SCAN expert panel (v4)."""
import json
import collections
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "stopscan-expert-panel" / "config.json"

LOG = {
    "id": "interactionLog",
    "prompt": "Interaction log",
    "location": "sidebar",
    "type": "reactive",
    "required": False,
    "hidden": True,
}

CASES = [
    ("case2", "Dana", "Case 1", "information"),
    ("case3", "Marcus", "Case 2", "information"),
    ("case4", "Ellen", "Case 3", "information"),
    ("case1", "Rekha", "Case 4", "request"),
]

STEPS = [
    ("source", "STOP and Source", 1),
    ("content", "Content", 2),
    ("alignment", "Alignment", 3),
    ("reflect", "Now Reflect", 4),
]

USEFUL_OPTS = [
    "This step was useful",
    "This step applied, but added nothing useful",
    "This step did not apply to this case",
    "This step led the reasoning in the wrong direction",
]

FIDELITY_OPTS = [
    "Yes, as described",
    "Partly",
    "No",
    "I cannot tell",
]

ELEMENTS = ["STOP", "Source", "Content", "Alignment", "Now Reflect"]
RANK_DEFAULT = {el: str(i) for i, el in enumerate(ELEMENTS)}

ENCOUNTER_LABEL = {
    "information": "information — nothing was being asked of them",
    "request": "a request — something was being asked of them",
    "alert": "an alert — a protective response might be needed now",
}


def step_component(cid, name, label_short, step_key, step_label, _step_idx):
    resp = []

    if step_key == "source":
        resp.append({
            "id": "stop_value",
            "prompt": f"Was recording {name}’s first reaction worth doing in this case?",
            "location": "sidebar",
            "type": "radio",
            "required": False,
            "options": [
                "Yes — it did real work here",
                "Only slightly",
                "No — it added nothing in this case",
                "I cannot tell",
            ],
        })

    resp.append({
        "id": "useful",
        "prompt": "How useful was this step in this case?",
        "location": "sidebar",
        "type": "radio",
        "required": False,
        "options": USEFUL_OPTS,
    })

    resp.append({
        "id": "fidelity",
        "prompt": "Was this step carried out as STOP&SCAN describes it?",
        "secondaryText": "This asks about our worked example, not about the framework itself.",
        "location": "sidebar",
        "type": "radio",
        "required": False,
        "options": FIDELITY_OPTS,
    })

    if step_key in ("content", "alignment"):
        resp.append({
            "id": "enough",
            "prompt": f"Is everything up to this point enough for {name} to stop and decide?",
            "location": "sidebar",
            "type": "radio",
            "required": False,
            "options": ["Yes", "No", "I cannot tell"],
        })

    note_prompt = (
        "Anything you disagree with, or that was carried out badly? What would "
        f"{name} have missed if they had followed only this step?"
    )
    if step_key in ("content", "alignment"):
        note_prompt = (
            "Anything you disagree with, or that was carried out badly? If you "
            "answered Yes above, what would they have concluded at this point?"
        )
    resp.append({
        "id": "note",
        "prompt": note_prompt,
        "secondaryText": "Optional. Everything on this page is optional.",
        "location": "sidebar",
        "type": "longText",
        "required": False,
        "placeholder": "Optional",
    })
    resp.append(LOG)

    return f"{cid}-{step_key}", {
        "baseComponent": "case-step",
        "previousButton": False,
        "parameters": {"caseId": cid, "stepKey": step_key, "mode": "step"},
        "meta": {"caseId": cid, "stepKey": step_key},
        "instruction": (
            f"**{label_short} — {step_label}.** Read what {name} did at this step, "
            "then tell us what you think in the sidebar."
        ),
        "response": resp,
    }


def after_component(cid, name, label_short, enc):
    return f"{cid}-after", {
        "baseComponent": "case-after",
        "previousButton": False,
        "parameters": {"caseId": cid, "mode": "after"},
        "meta": {"caseId": cid},
        "instruction": (
            f"**{label_short} — after the case.** Rank the five elements below the recap, "
            "then answer the remaining questions in the sidebar."
        ),
        "response": [
            {
                "id": "contribution",
                "prompt": "Rank the five elements by how much each contributed in this case.",
                "secondaryText": (
                    "The list starts in the framework’s own order. Drag to reorder. "
                    "Most contribution at the top; least at the bottom."
                ),
                "location": "belowStimulus",
                "type": "ranking-sublist",
                "required": False,
                "options": ELEMENTS,
                "numItems": 5,
                "default": RANK_DEFAULT,
            },
            {
                "id": "direction",
                "prompt": f"At the point {name} stopped, what did the evidence support?",
                "location": "sidebar",
                "type": "radio",
                "required": False,
                "options": [
                    "It supported the claim the content makes",
                    "It undermined the claim the content makes",
                    "No resolution was reached",
                ],
            },
            {
                "id": "encounter",
                "prompt": (
                    f"{name} treated this as {ENCOUNTER_LABEL[enc]}. "
                    "Would a reasonable person have read the situation the same way?"
                ),
                "secondaryText": "STOP&SCAN uses this reading to decide what action follows from the evidence.",
                "location": "sidebar",
                "type": "radio",
                "required": False,
                "options": [
                    "Yes",
                    "Some would read it differently",
                    "No — most people would read it differently",
                    "I cannot tell",
                ],
            },
            {
                "id": "narrow",
                "prompt": (
                    f"If {name} had checked only the source, or only run a detection "
                    "or provenance tool, what would they have concluded?"
                ),
                "location": "sidebar",
                "type": "longText",
                "required": False,
                "placeholder": "Optional",
            },
            {
                "id": "other_checks",
                "prompt": (
                    f"Given what {name} concluded — including, where that applies, a "
                    "decision not to conclude — would any other check have helped?"
                ),
                "location": "sidebar",
                "type": "longText",
                "required": False,
                "placeholder": "Optional",
            },
            LOG,
        ],
    }


def sift_component(cid, title):
    routes = []
    for r in ("routeA", "routeB"):
        label = "Route A" if r == "routeA" else "Route B"
        routes += [
            {
                "id": f"{r}_plausible",
                "prompt": f"**{label}.** Could a competent non-expert reasonably follow this route?",
                "location": "sidebar",
                "type": "radio",
                "required": False,
                "options": ["Yes", "Yes but unlikely", "No, this is not how it would go"],
            },
            {
                "id": f"{r}_note",
                "prompt": "If yes or yes-but-unlikely, why? If no, what would a more realistic route look like?",
                "secondaryText": "Optional. Use whichever part applies.",
                "location": "sidebar",
                "type": "longText",
                "required": False,
                "placeholder": "Optional",
            },
        ]
    return f"sift-{cid}", {
        "type": "react-component",
        "path": "stopscan-expert-panel/assets/SiftRoutes.tsx",
        "nextButtonLocation": "sidebar",
        "instructionLocation": "sidebar",
        "sidebarWidth": 400,
        "previousButton": False,
        "parameters": {"caseId": cid},
        "instruction": f"**{title}** Open each route when you are ready to review it, then answer in the sidebar.",
        "response": routes + [
            {
                "id": "prevent",
                "prompt": "Where either route reaches a wrong conclusion, what additional check would have prevented it?",
                "location": "sidebar",
                "type": "longText",
                "required": False,
                "placeholder": "Optional",
            },
            LOG,
        ],
    }


AGREE5 = ["Strongly disagree", "Disagree", "Neither", "Agree", "Strongly agree"]

components = collections.OrderedDict()

components["consent"] = {
    "type": "website",
    "path": "stopscan-expert-panel/assets/consent.html",
    "nextButtonLocation": "sidebar",
    "previousButton": False,
    "instruction": "Please read the consent document, then confirm in the sidebar.",
    "instructionLocation": "sidebar",
    "response": [
        {
            "id": "consent_confirm",
            "prompt": (
                "I have read this document and had the chance to ask questions. I am 18 "
                "or older. I understand that taking part is voluntary, that I may skip "
                "any question and stop at any time, that my responses are recorded under "
                "a code and cannot be edited once submitted, and that de-identified "
                "quotations may be published."
            ),
            "location": "sidebar",
            "type": "checkbox",
            "required": True,
            "options": ["I confirm"],
        },
        {
            "id": "consent_eu_transfer",
            "prompt": (
                "(Participants in the EEA, UK, or Switzerland) I explicitly consent to my "
                "data being processed as described and transferred to the United States."
            ),
            "location": "sidebar",
            "type": "checkbox",
            "required": False,
            "options": ["I consent to transfer"],
        },
        {
            "id": "consent_participate",
            "prompt": "I consent to take part in this study.",
            "location": "sidebar",
            "type": "radio",
            "required": True,
            "options": ["I consent", "I do not consent"],
        },
    ],
}

components["about-you"] = {
    "type": "markdown",
    "path": "stopscan-expert-panel/assets/about-you.md",
    "nextButtonLocation": "sidebar",
    "instructionLocation": "sidebar",
    "previousButton": False,
    "instruction": "Please answer the four short questions in the sidebar.",
    "withSidebar": True,
    "response": [
        {
            "id": "B1",
            "prompt": "Which area best describes most of your professional work?",
            "location": "sidebar",
            "type": "radio",
            "required": False,
            "options": [
                "Digital media forensics",
                "Misinformation or disinformation research",
                "Media literacy education",
                "Fact-checking or verification journalism",
            ],
        },
        {
            "id": "B2",
            "prompt": "Do you also work regularly in any of these other areas?",
            "location": "sidebar",
            "type": "checkbox",
            "required": False,
            "options": [
                "Digital media forensics",
                "Misinformation or disinformation research",
                "Media literacy education",
                "Fact-checking or verification journalism",
            ],
        },
        {
            "id": "B3",
            "prompt": "About how long have you worked in this field?",
            "location": "sidebar",
            "type": "radio",
            "required": False,
            "options": ["Under 3 years", "3–7 years", "8–15 years", "More than 15 years"],
        },
        {
            "id": "B4",
            "prompt": "How familiar are you with SIFT, the Four Moves, or lateral reading?",
            "location": "sidebar",
            "type": "radio",
            "required": False,
            "options": [
                "I am not familiar with them",
                "I have heard of them but have not used them",
                "I have used or taught them occasionally",
                "I use or teach them regularly",
                "I have contributed to work on them",
            ],
        },
    ],
}

components["orientation"] = {
    "type": "react-component",
    "path": "stopscan-expert-panel/assets/Orientation.tsx",
    "nextButtonLocation": "sidebar",
    "previousButton": False,
    "instruction": "Please read this introduction to STOP&SCAN. The summaries at the end stay available for reference throughout.",
    "instructionLocation": "sidebar",
    "response": [LOG],
}

for cid, name, short, enc in CASES:
    for skey, slabel, sidx in STEPS:
        key, val = step_component(cid, name, short, skey, slabel, sidx)
        components[key] = val
    key, val = after_component(cid, name, short, enc)
    components[key] = val

key, val = sift_component("case2", "The wind forecast map — if Dana had used SIFT.")
components[key] = val
key, val = sift_component("case4", "The senator’s photograph — if Ellen had used SIFT.")
components[key] = val

components["ratings-stopscan"] = {
    "type": "react-component",
    "path": "stopscan-expert-panel/assets/RatingStimulus.tsx",
    "nextButtonLocation": "sidebar",
    "instructionLocation": "sidebar",
    "sidebarWidth": 460,
    "previousButton": False,
    "parameters": {"section": "stopscan"},
    "instruction": "Rate STOP&SCAN on the statements below. Optional comments are in the sidebar.",
    "response": [
        {
            "id": "R_stopscan",
            "prompt": "How far do you agree with each statement about STOP&SCAN?",
            "location": "belowStimulus",
            "type": "matrix-radio",
            "required": False,
            "answerOptions": AGREE5,
            "questionOptions": [
                "R2. The framework includes the right elements and leaves out nothing essential.",
                "R3. It is useful to distinguish the number of steps completed from the number of independent kinds of evidence found.",
                "R4. Requiring two independent kinds of evidence before a resolved conclusion is an appropriate threshold.",
                "R5. A non-expert could tell whether two kinds of evidence are genuinely independent.",
                "R7. “Unresolved” is a realistic result that people would be willing to accept.",
                "R8. STOP&SCAN handles authentic content wrongly described as fake as well as it handles fabricated content.",
                "R21. Separating the evidence state from the action that follows is a useful distinction for non-experts.",
                "R22. A non-expert could tell which kind of situation they are in — information, a request, or an alert.",
            ],
        },
        {
            "id": "R4_why",
            "prompt": "R4 — the two-evidence threshold. Why?",
            "secondaryText": "Optional.",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        {
            "id": "R5_why",
            "prompt": "R5 — judging independence. Why?",
            "secondaryText": "Optional.",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        {
            "id": "R7_why",
            "prompt": "R7 — accepting an unresolved result. Why?",
            "secondaryText": "Optional.",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        {
            "id": "R22_why",
            "prompt": "R22 — reading the kind of situation. Why?",
            "secondaryText": "Optional.",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        LOG,
    ],
}

components["ratings-sift"] = {
    "type": "react-component",
    "path": "stopscan-expert-panel/assets/RatingStimulus.tsx",
    "nextButtonLocation": "sidebar",
    "instructionLocation": "sidebar",
    "sidebarWidth": 460,
    "previousButton": False,
    "parameters": {"section": "sift"},
    "instruction": "Rate SIFT on the statements below. We have not yet told you what we think. Optional comments are in the sidebar.",
    "response": [
        {
            "id": "R_sift",
            "prompt": "How far do you agree with each statement about SIFT?",
            "location": "belowStimulus",
            "type": "matrix-radio",
            "required": False,
            "answerOptions": AGREE5,
            "questionOptions": [
                "R9. SIFT remains useful for evaluating content that may be AI-generated or manipulated.",
                "R10. Allowing someone to stop after one SIFT move is appropriate.",
                "R12. SIFT gives enough guidance when a trustworthy source publishes incorrect or fabricated content.",
                "R13. SIFT gives enough guidance when authentic content is wrongly described as AI-generated.",
                "R14. SIFT’s newer guidance adequately addresses content that may itself have been generated by AI.",
            ],
        },
        {
            "id": "R14_why",
            "prompt": "R14 — the AI-specific guidance. Why?",
            "secondaryText": "Optional.",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        LOG,
    ],
}

components["ratings-open"] = {
    "type": "react-component",
    "path": "stopscan-expert-panel/assets/RatingStimulus.tsx",
    "nextButtonLocation": "sidebar",
    "instructionLocation": "sidebar",
    "sidebarWidth": 460,
    "previousButton": False,
    "parameters": {"section": "open"},
    "instruction": "Open critique, before we state our own positions on SIFT. All optional.",
    "response": [
        {"id": "O1", "prompt": "Where is STOP&SCAN most likely to fail in everyday use?", "location": "sidebar", "type": "longText", "required": False, "placeholder": "Optional"},
        {"id": "O2", "prompt": "Which element is weakest? How would you change it?", "location": "sidebar", "type": "longText", "required": False, "placeholder": "Optional"},
        {"id": "O3", "prompt": "STOP&SCAN asks people to visit every element, even when an earlier one seems to settle the case. Is that right?", "location": "sidebar", "type": "longText", "required": False, "placeholder": "Optional"},
        {"id": "O4", "prompt": "What, if anything, does STOP&SCAN add that SIFT or lateral reading does not already provide?", "location": "sidebar", "type": "longText", "required": False, "placeholder": "Optional"},
        {"id": "O5", "prompt": "What evidence would you need before recommending STOP&SCAN to non-experts?", "location": "sidebar", "type": "longText", "required": False, "placeholder": "Optional"},
        {"id": "O6", "prompt": "Is there an approach from your own work that neither framework captures?", "location": "sidebar", "type": "longText", "required": False, "placeholder": "Optional"},
        {"id": "O7", "prompt": "Did our worked examples represent STOP&SCAN fairly, or did they make it look better or worse than it is?", "location": "sidebar", "type": "longText", "required": False, "placeholder": "Optional"},
        LOG,
    ],
}

components["ratings-critique"] = {
    "type": "react-component",
    "path": "stopscan-expert-panel/assets/RatingStimulus.tsx",
    "nextButtonLocation": "sidebar",
    "instructionLocation": "sidebar",
    "sidebarWidth": 460,
    "previousButton": False,
    "parameters": {"section": "critique"},
    "instruction": "Read our positions in the main pane, respond to the four concerns below, then use the sidebar for the remaining questions.",
    "response": [
        {
            "id": "Q1",
            "prompt": "Where do you stand on each of our four concerns about SIFT?",
            "location": "belowStimulus",
            "type": "matrix-radio",
            "required": False,
            "answerOptions": ["Agree", "Agree but overstated", "Disagree", "No view"],
            "questionOptions": [
                "On Stop",
                "On Investigate the source",
                "On Find better coverage",
                "On Trace to the original context",
            ],
        },
        {
            "id": "Q1_note",
            "prompt": "Anything you want to say about those four.",
            "secondaryText": "Optional.",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        {
            "id": "Q2",
            "prompt": "Is our concern about SIFT’s AI-specific guidance fair?",
            "location": "sidebar",
            "type": "radio",
            "required": False,
            "options": ["Agree", "Agree but overstated", "Disagree", "No view"],
        },
        {
            "id": "Q2_why",
            "prompt": "Why?",
            "secondaryText": "Optional.",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        {
            "id": "Q3",
            "prompt": "What concerns or weaknesses in SIFT have we missed?",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        {
            "id": "Q4",
            "prompt": "Which of these concerns do you think is mistaken, and why?",
            "location": "sidebar",
            "type": "longText",
            "required": False,
            "placeholder": "Optional",
        },
        LOG,
    ],
}

compare_items = [
    ("R15", "Which approach is more likely to produce an appropriately cautious judgment?"),
    ("R16", "Which approach would be easier to teach?"),
    ("R17", "Which approach is more reliable when search results contain misleading or AI-generated information?"),
    ("R18", "Which would you recommend to someone with no training in verification?"),
    ("R19", "Which would you recommend to a professional, and which better matches the range of cases you meet in your own work?"),
]
compare_resp = []
for rid, prompt in compare_items:
    compare_resp.append({
        "id": rid,
        "prompt": prompt,
        "location": "sidebar",
        "type": "slider",
        "required": False,
        "snap": True,
        "options": [
            {"label": "SIFT", "value": 0},
            {"label": "No preference", "value": 50},
            {"label": "STOP&SCAN", "value": 100},
        ],
        "startingValue": 50,
    })
compare_resp.append({
    "id": "compare_flags",
    "prompt": "Were there comparisons above you did not feel able to make?",
    "secondaryText": "Optional. Select any that apply.",
    "location": "sidebar",
    "type": "checkbox",
    "required": False,
    "options": [{"label": prompt, "value": rid} for rid, prompt in compare_items] + [
        "Neither framework is adequate for this comparison"
    ],
})
compare_resp.append(LOG)
components["ratings-compare"] = {
    "type": "react-component",
    "path": "stopscan-expert-panel/assets/RatingStimulus.tsx",
    "nextButtonLocation": "sidebar",
    "instructionLocation": "sidebar",
    "sidebarWidth": 460,
    "previousButton": False,
    "parameters": {"section": "compare"},
    "instruction": "Comparative judgments between SIFT and STOP&SCAN.",
    "response": compare_resp,
}

components["debrief"] = {
    "type": "website",
    "path": "stopscan-expert-panel/assets/debrief.html",
    "nextButtonLocation": "sidebar",
    "previousButton": False,
    "instruction": "Thank you. Please read the debrief, then submit.",
    "instructionLocation": "sidebar",
    "response": [
        {
            "id": "summary_optin",
            "prompt": "Would you like a summary of the findings and a copy of the accepted publication?",
            "location": "sidebar",
            "type": "radio",
            "required": False,
            "options": ["Yes, please email me", "No thank you"],
        },
    ],
}

order = ["consent", "about-you", "orientation"]
for cid, *_ in CASES:
    order += [f"{cid}-{s[0]}" for s in STEPS] + [f"{cid}-after"]
order += [
    "sift-case2", "sift-case4", "ratings-stopscan", "ratings-sift",
    "ratings-open", "ratings-critique", "ratings-compare", "debrief",
]

config = {
    "$schema": "https://raw.githubusercontent.com/revisit-studies/study/v2.4.3/src/parser/StudyConfigSchema.json",
    "studyMetadata": {
        "title": "STOP&SCAN Expert Panel",
        "version": "v4",
        "authors": ["Saniat Javid Sohrawardi", "Kelly Wu", "Fatma Aksu"],
        "date": "2026-08-26",
        "description": "Review how STOP&SCAN is used in four documented cases and compare it with SIFT and with detection and provenance tools.",
        "organizations": ["Rochester Institute of Technology", "University of Bologna"],
    },
    "uiConfig": {
        "contactEmail": "john.sohrawardi@rit.edu",
        "helpTextPath": "stopscan-expert-panel/assets/help.md",
        "logoPath": "revisitAssets/revisitLogoSquare.svg",
        "withProgressBar": True,
        "autoDownloadStudy": False,
        "withSidebar": True,
        "sidebarWidth": 400,
        "enumerateQuestions": True,
        "studyEndMsg": "Thank you for completing the STOP&SCAN expert panel. You may close this window.",
    },
    "baseComponents": {
        "case-step": {
            "type": "react-component",
            "path": "stopscan-expert-panel/assets/CaseStimulus.tsx",
            "nextButtonLocation": "sidebar",
            "instructionLocation": "sidebar",
            "sidebarWidth": 420,
        },
        "case-after": {
            "type": "react-component",
            "path": "stopscan-expert-panel/assets/CaseStimulus.tsx",
            "nextButtonLocation": "sidebar",
            "instructionLocation": "sidebar",
            "sidebarWidth": 420,
        },
    },
    "components": components,
    "sequence": {
        "order": "fixed",
        "components": order,
        "skip": [{
            "name": "consent",
            "check": "response",
            "responseId": "consent_participate",
            "value": "I do not consent",
            "comparison": "equal",
            "to": "end",
        }],
    },
}

OUT.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf8")
n = sum(1 for c in components.values() for r in c.get("response", []) if r["id"] != "interactionLog")
print(f"wrote {OUT}")
print(f"components: {len(components)}  ordered: {len(order)}  participant-facing fields: {n}")
print("missing from components:", [c for c in order if c not in components])
print("not in order:", [c for c in components if c not in order])
