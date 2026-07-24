// Central mock data for the CaseFlow demo. In production, each section below
// would be populated by a per-stage AI extraction pipeline instead of being
// hardcoded here.

export const caseOverview = {
  clientName: "Maria Alvarez",
  caseNumber: "PI-2025-0417",
  firmName: "Halloran & Voss, LLP",
  attorneyName: "J. Halloran, Esq.",
  incidentDate: "2025-03-11",
  status: "Treatment Complete — Preparing Demand",
  estimatedDamages: 128450,
  nextAction: "Review AI-drafted negotiation letter",
};

export function daysSince(dateStr: string) {
  const start = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.max(0, Math.round((now - start) / (1000 * 60 * 60 * 24)));
}

export const insightsFeed = [
  {
    id: 1,
    title: "New medical record processed",
    detail: "3 new diagnoses detected in St. Mary's Ortho follow-up, added to Treatment Timeline.",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Treatment gap flagged",
    detail: "34-day gap identified between physical therapy discharge and pain management follow-up.",
    time: "1 day ago",
  },
  {
    id: 3,
    title: "Quality of Life questionnaire submitted",
    detail: "Client completed 8 of 8 sections. AI summary generated for attorney review.",
    time: "3 days ago",
  },
  {
    id: 4,
    title: "Financial totals updated",
    detail: "Lost wages figure revised after new employer letter uploaded.",
    time: "4 days ago",
  },
];

export const documents = [
  {
    id: "doc-1",
    name: "PD_Incident_Report_2025-03-11.pdf",
    type: "Police Report",
    category: "Incident",
    uploadDate: "2025-03-13",
    status: "Processed",
  },
  {
    id: "doc-2",
    name: "StMarys_ER_Intake.pdf",
    type: "Medical Record",
    category: "Treatment",
    uploadDate: "2025-03-11",
    status: "Processed",
  },
  {
    id: "doc-3",
    name: "StMarys_Ortho_Followup_04-02.pdf",
    type: "Medical Record",
    category: "Treatment",
    uploadDate: "2025-04-03",
    status: "Processed",
  },
  {
    id: "doc-4",
    name: "MRI_Lumbar_Spine_04-09.pdf",
    type: "Medical Record",
    category: "Treatment",
    uploadDate: "2025-04-10",
    status: "Processed",
  },
  {
    id: "doc-5",
    name: "PT_Discharge_Summary_06-18.pdf",
    type: "Medical Record",
    category: "Treatment",
    uploadDate: "2025-06-19",
    status: "Processed",
  },
  {
    id: "doc-6",
    name: "Pain_Mgmt_Followup_07-22.pdf",
    type: "Medical Record",
    category: "Treatment",
    uploadDate: "2025-07-23",
    status: "Processed",
  },
  {
    id: "doc-7",
    name: "Accident_Scene_Photo_01.jpg",
    type: "Photo",
    category: "Incident",
    uploadDate: "2025-03-11",
    status: "Processed",
  },
  {
    id: "doc-8",
    name: "St_Marys_Billing_Statement.pdf",
    type: "Billing",
    category: "Financial",
    uploadDate: "2025-05-02",
    status: "Processed",
  },
  {
    id: "doc-9",
    name: "Employer_Wage_Loss_Letter.pdf",
    type: "Billing",
    category: "Financial",
    uploadDate: "2025-05-14",
    status: "Processing",
  },
  {
    id: "doc-10",
    name: "Client_Correspondence_thread.pdf",
    type: "Correspondence",
    category: "Intake",
    uploadDate: "2025-04-20",
    status: "Processed",
  },
];

export const policeReport = {
  summary:
    "On March 11, 2025, the client's vehicle was struck from behind while stopped at a red light at the intersection of 5th Ave and Miller St. The responding officer's report cites the other driver for following too closely and issues a traffic citation. No citations were issued to the client. Officer notes describe visible rear bumper damage and the other driver's admission of distraction at the scene.",
  keyPoints: [
    { label: "Date", value: "March 11, 2025, 5:42 PM" },
    { label: "Location", value: "5th Ave & Miller St., Springfield" },
    { label: "Parties Involved", value: "Maria Alvarez (client), Dennis Ruiz (other driver)" },
    { label: "Fault Indicator", value: "Other driver cited — following too closely" },
    { label: "Citation Issued", value: "VC 12-411, issued to D. Ruiz" },
    { label: "Officer Notes", value: "Other driver stated he \"looked down at his phone for a second\"" },
  ],
  sourceDocument: "PD_Incident_Report_2025-03-11.pdf",
};

export const medicalReport = {
  summary:
    "Medical records span five providers over 133 days: an initial ER evaluation, orthopedic follow-up, lumbar MRI, an 11-week physical therapy course, and a pain management follow-up. Diagnoses center on an L4-L5 disc herniation (a bulging or ruptured disc between the 4th and 5th lower back vertebrae) with mild nerve root impingement (pressure on a spinal nerve root that can cause pain, numbness, or weakness radiating into the leg). Treatment progressed from acute care to conservative management, with documented improvement by physical therapy discharge.",
  keyPoints: [
    { label: "Diagnoses", value: "Lumbar strain; L4-L5 disc herniation with mild nerve root impingement" },
    { label: "Treating Providers", value: "Springfield General ER; St. Mary's Orthopedics (Dr. R. Chen); Springfield Imaging Center; Core Physical Therapy; Springfield Pain Management (Dr. A. Okafor)" },
    { label: "Procedures", value: "X-ray (ER); Lumbar MRI; 22 sessions of physical therapy" },
    { label: "Medications Noted", value: "OTC analgesics; muscle relaxant prescribed at ortho follow-up" },
    { label: "Dates of Service", value: "March 11, 2025 – July 22, 2025" },
  ],
  sourceDocument: "StMarys_Ortho_Followup_04-02.pdf",
};

export type TimelineEvent = {
  date: string;
  provider: string;
  eventType: string;
  notes: string;
  source: string;
  gapAfterDays?: number;
};

export const treatmentTimeline: {
  severity: number; // 0-100
  severityLabel: string;
  injuryClassification: "Permanent" | "Non-Permanent";
  symptoms: string[];
  treatmentSummary: string;
  events: TimelineEvent[];
  exportHistory: { name: string; date: string; format: string }[];
} = {
  severity: 62,
  severityLabel: "Moderate–High Impact",
  injuryClassification: "Non-Permanent",
  symptoms: [
    "Lower back pain radiating to left leg",
    "Reduced range of motion in lumbar spine",
    "Intermittent numbness in left foot",
    "Tension headaches (first 3 weeks post-incident)",
  ],
  treatmentSummary:
    "Initial ER evaluation followed by orthopedic referral, lumbar MRI confirming disc involvement, an 11-week physical therapy course, and a pain management follow-up after a treatment gap.",
  events: [
    {
      date: "2025-03-11",
      provider: "Springfield General ER",
      eventType: "ER Visit",
      notes: "Evaluated for acute lower back pain and whiplash-type symptoms following rear-end collision. X-rays negative for fracture.",
      source: "StMarys_ER_Intake.pdf",
    },
    {
      date: "2025-04-02",
      provider: "St. Mary's Orthopedics — Dr. R. Chen",
      eventType: "Orthopedic Follow-up",
      notes: "Diagnosed with lumbar strain and suspected disc involvement (lumbar disc herniation, a bulging or ruptured disc in the lower back that can press on nearby nerves). MRI ordered.",
      source: "StMarys_Ortho_Followup_04-02.pdf",
    },
    {
      date: "2025-04-09",
      provider: "Springfield Imaging Center",
      eventType: "MRI",
      notes: "Lumbar MRI confirms L4-L5 disc herniation (a bulging or ruptured disc between the 4th and 5th lower back vertebrae) with mild nerve root impingement (pressure on a spinal nerve root, which can cause pain, numbness, or weakness radiating into the leg).",
      source: "MRI_Lumbar_Spine_04-09.pdf",
    },
    {
      date: "2025-04-16",
      provider: "Core Physical Therapy",
      eventType: "Physical Therapy — Start",
      notes: "Began twice-weekly physical therapy for lumbar strengthening and pain management.",
      source: "StMarys_Ortho_Followup_04-02.pdf",
    },
    {
      date: "2025-06-18",
      provider: "Core Physical Therapy",
      eventType: "Physical Therapy — Discharge",
      notes: "Discharged after 11 weeks. Reports 60% improvement in pain, residual stiffness with prolonged sitting.",
      source: "PT_Discharge_Summary_06-18.pdf",
      gapAfterDays: 34,
    },
    {
      date: "2025-07-22",
      provider: "Springfield Pain Management — Dr. A. Okafor",
      eventType: "Pain Management Follow-up",
      notes: "Follow-up for residual lumbar pain. Recommended home exercise program; no further procedures scheduled at this time.",
      source: "Pain_Mgmt_Followup_07-22.pdf",
    },
  ],
  exportHistory: [
    { name: "Alvarez_Treatment_Timeline_v2.pdf", date: "2025-07-20", format: "PDF" },
    { name: "Alvarez_Treatment_Timeline_v1.pdf", date: "2025-06-25", format: "PDF" },
  ],
};

export const qualityOfLifeSections = [
  {
    id: "pain",
    title: "Pain Levels",
    questions: [
      { q: "On a scale of 0–10, how would you rate your pain immediately after the incident?", a: "8 out of 10" },
      { q: "On a scale of 0–10, how would you rate your pain today?", a: "3 out of 10, worse by end of day" },
      { q: "Is the pain constant or does it come and go?", a: "Comes and goes — worse after sitting for long periods or standing for over an hour" },
    ],
  },
  {
    id: "activity",
    title: "Daily Activity Limitations",
    questions: [
      { q: "Has this affected your ability to work?", a: "Missed 3 weeks entirely, then returned part-time for 2 additional weeks" },
      { q: "Has this affected household tasks (cleaning, cooking, childcare)?", a: "Cannot lift my toddler or carry laundry baskets without pain" },
      { q: "Has this affected hobbies or exercise?", a: "Stopped running and yoga classes; walking is the only activity I've kept up" },
    ],
  },
  {
    id: "emotional",
    title: "Emotional & Psychological Impact",
    questions: [
      { q: "Have you experienced anxiety, frustration, or low mood connected to the injury?", a: "Yes — frustrated with how slow recovery has been, some anxiety driving through that intersection again" },
      { q: "Has this affected your confidence in daily movement?", a: "I'm more cautious and hesitant, especially lifting anything" },
    ],
  },
  {
    id: "social",
    title: "Relationships & Social Life",
    questions: [
      { q: "Has this affected time with family or friends?", a: "Skipped two family gatherings that involved a lot of standing or travel" },
      { q: "Has your role at home changed?", a: "My partner has taken over most physical chores since the incident" },
    ],
  },
  {
    id: "sleep",
    title: "Sleep Quality",
    questions: [
      { q: "Has your sleep changed since the incident?", a: "Trouble finding a comfortable position; waking up 2-3 times most nights during the first two months" },
    ],
  },
  {
    id: "additional",
    title: "Additional Context",
    questions: [
      { q: "Is there anything else you'd like your attorney to know?", a: "I'm most worried about whether the back pain will come back if I go back to my normal activity level — my PT said it might flare up under stress on the spine." },
    ],
  },
];

export const qualityOfLifeSummary =
  "Client reports a marked reduction in pain since the incident (8/10 acute, 3/10 current) but continued flare-ups with prolonged sitting or standing. Daily impact included three weeks of missed work, ongoing inability to lift her toddler or complete physical household tasks, and discontinuation of running and yoga. She describes emotional strain tied to the slow pace of recovery and some situational anxiety near the incident location. Sleep disruption was significant in the first two months post-incident. Client also expresses ongoing concern about re-injury risk during normal activity.";

export const financials = {
  medicalBills: [
    { provider: "Springfield General ER", amount: 3420 },
    { provider: "St. Mary's Orthopedics", amount: 2150 },
    { provider: "Springfield Imaging Center (MRI)", amount: 4300 },
    { provider: "Core Physical Therapy (22 sessions)", amount: 6600 },
    { provider: "Springfield Pain Management", amount: 980 },
  ],
  lostWages: {
    description: "3 weeks fully missed + 2 weeks reduced (part-time) at Redwood Logistics",
    amount: 5400,
  },
  propertyDamage: {
    description: "Rear bumper and trunk repair, 2021 Honda Civic",
    amount: 3200,
  },
  otherEconomic: [
    { label: "Mileage to appointments (32 round trips)", amount: 410 },
    { label: "Over-the-counter medication & lumbar support brace", amount: 185 },
  ],
};

export const negotiationLetterDraft = `[FIRM LETTERHEAD]

${caseOverview.firmName}
Re: Claim of Maria Alvarez — Case No. ${caseOverview.caseNumber}
Date of Loss: March 11, 2025

To Whom It May Concern:

This firm represents Maria Alvarez in connection with injuries sustained in a motor vehicle collision on March 11, 2025, at the intersection of 5th Ave and Miller St. Your insured, Dennis Ruiz, was cited at the scene for following too closely and was the sole at-fault party.

LIABILITY
The responding officer's report confirms your insured struck our client's vehicle from behind while she was stopped at a red light, and your insured acknowledged distraction at the time of impact. Liability is not in dispute on this record.

INJURIES AND TREATMENT
Following the collision, Ms. Alvarez was evaluated at Springfield General ER for acute lower back pain. Subsequent orthopedic evaluation and MRI imaging confirmed an L4-L5 disc herniation with nerve root impingement. She completed an 11-week course of physical therapy and continues to follow up with pain management for residual symptoms.

IMPACT ON DAILY LIFE
Ms. Alvarez missed three weeks of work entirely and returned on a reduced schedule for two additional weeks. She has been unable to lift her toddler, perform routine household tasks, or continue running and yoga, activities she previously engaged in regularly. She has also reported disrupted sleep and ongoing apprehension around the site of the collision.

DAMAGES SUMMARY
Medical specials (confirmed): $17,450
Lost wages (confirmed): $5,400
Property damage (confirmed): $3,200
Other economic damages (confirmed): $595

We look forward to discussing prompt and fair resolution of this claim.

Sincerely,

${caseOverview.attorneyName}
${caseOverview.firmName}`;
