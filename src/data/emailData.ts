
import { Email } from "@/types/email";
import { addDays, subDays, subHours } from "date-fns";

// Helper function to get dates relative to now
const getRelativeDate = (days: number) => {
  return subDays(new Date(), Math.abs(days)).toISOString();
};

export const emailData: Email[] = [
  {
    id: "email-1",
    subject: "Updated Treatment Protocol for Cardiovascular Patients",
    from: {
      name: "Dr. Priya Sharma",
      email: "priya.sharma@havenmed.com",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    to: [
      { name: "John Doe", email: "john.doe@havenmed.com" }
    ],
    body: `Dear Dr. Doe,

I'm writing to share the updated treatment protocol for cardiovascular patients that was approved at yesterday's department meeting. The new protocol incorporates the latest research findings and recommendations from the National Cardiology Association.

Key changes include:

1. Updated first-line medication recommendations
2. Modified diagnostic pathway for patients with ambiguous symptoms
3. New post-operative care guidelines with emphasis on early mobilization

Please review the attached document and implement these changes in your practice effective immediately. There will be a brief training session on Friday at 2 PM to address any questions.

Best regards,
Dr. Priya Sharma
Head of Cardiology`,
    date: getRelativeDate(1),
    read: false,
    starred: true,
    folder: "inbox",
    attachments: [
      {
        name: "Cardio_Treatment_Protocol_v3.2.pdf",
        size: "2.4MB",
        type: "pdf"
      },
      {
        name: "Implementation_Guidelines.docx",
        size: "1.1MB",
        type: "docx"
      }
    ]
  },
  {
    id: "email-2",
    subject: "Patient Referral: Ravi Kumar (ID: P-39281)",
    from: {
      name: "Dr. Amit Patel",
      email: "amit.patel@havenmed.com",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    to: [
      { name: "John Doe", email: "john.doe@havenmed.com" }
    ],
    body: `Dear Dr. Doe,

I am referring Mr. Ravi Kumar (Patient ID: P-39281) to your department for specialized orthopedic consultation. 

The patient is a 45-year-old male with persistent lower back pain that has not responded to conventional treatment over the last 3 months. MRI results show potential disc herniation at L4-L5. 

Patient history and all relevant imaging reports are attached for your review. Given the patient's worsening mobility issues, I would appreciate if you could see him at your earliest convenience.

Thank you for your assistance.

Regards,
Dr. Amit Patel
Internal Medicine`,
    date: getRelativeDate(2),
    read: true,
    folder: "inbox",
    attachments: [
      {
        name: "Patient_Ravi_Kumar_Records.pdf",
        size: "3.7MB",
        type: "pdf"
      },
      {
        name: "MRI_L4_L5_Kumar.jpg",
        size: "1.8MB",
        type: "jpg"
      }
    ]
  },
  {
    id: "email-3",
    subject: "Hospital Staff Meeting - Agenda for Next Week",
    from: {
      name: "Dr. Suresh Reddy",
      email: "suresh.reddy@havenmed.com",
      avatar: "https://randomuser.me/api/portraits/men/37.jpg"
    },
    to: [
      { name: "All Staff", email: "all-staff@havenmed.com" }
    ],
    cc: [
      { name: "Hospital Administration", email: "admin@havenmed.com" }
    ],
    body: `Dear Colleagues,

This is a reminder about our monthly staff meeting scheduled for next Wednesday, July 15th, at 9:00 AM in the main conference room.

Agenda items include:

1. Budget review for Q3
2. Introduction of new staff members
3. Updates on the hospital expansion project
4. COVID-19 protocols review
5. Open forum for department concerns

Please send any additional agenda items by Monday. Attendance is mandatory for all department heads and encouraged for all staff.

Regards,
Dr. Suresh Reddy
Hospital Director`,
    date: getRelativeDate(3),
    read: true,
    folder: "inbox",
    attachments: [
      {
        name: "Staff_Meeting_Agenda_July.pdf",
        size: "521KB",
        type: "pdf"
      }
    ]
  },
  {
    id: "email-4",
    subject: "New Medical Equipment Training Session",
    from: {
      name: "Anika Singh",
      email: "anika.singh@havenmed.com",
      avatar: "https://randomuser.me/api/portraits/women/23.jpg"
    },
    to: [
      { name: "Medical Staff", email: "medical-staff@havenmed.com" }
    ],
    body: `Hello Everyone,

We have scheduled a training session for the newly acquired MRI machine next Tuesday from 2-4 PM in Radiology Department. 

The session will cover:
- Basic operation procedures
- Patient preparation protocols
- Image acquisition techniques
- Maintenance requirements

All radiologists and technicians must attend. Other interested staff members are welcome.

Please confirm your attendance by responding to this email.

Best regards,
Anika Singh
Head Nurse, Radiology`,
    date: subHours(new Date(), 5).toISOString(),
    read: false,
    folder: "inbox"
  },
  {
    id: "email-5",
    subject: "Laboratory Results: Patient Meera Patel (ID: P-45129)",
    from: {
      name: "Laboratory Department",
      email: "lab@havenmed.com"
    },
    to: [
      { name: "John Doe", email: "john.doe@havenmed.com" }
    ],
    body: `Dr. Doe,

The laboratory results for patient Meera Patel (ID: P-45129) are now available in the system.

Critical values detected:
- Hemoglobin: 8.2 g/dL (Low)
- White Blood Cell Count: 15,200/µL (High)

Please review the complete report attached and take appropriate action.

This is an automated message from the Laboratory Information System.`,
    date: getRelativeDate(4),
    read: true,
    folder: "inbox",
    attachments: [
      {
        name: "Lab_Results_P45129.pdf",
        size: "1.2MB",
        type: "pdf"
      }
    ]
  },
  {
    id: "email-6",
    subject: "Prescription Request Approval",
    from: {
      name: "John Doe",
      email: "john.doe@havenmed.com",
      avatar: "/placeholder.svg"
    },
    to: [
      { name: "Pharmacy Department", email: "pharmacy@havenmed.com" }
    ],
    body: `Dear Pharmacy Team,

I am approving the prescription renewal request for patient Ananya Gupta (ID: P-28476).

Medication: Metformin 500mg
Dosage: 1 tablet twice daily
Duration: 3 month supply
Refills: 3

Please process this prescription at your earliest convenience.

Thank you,
Dr. John Doe
Internal Medicine`,
    date: subDays(new Date(), 7).toISOString(),
    read: true,
    folder: "sent"
  },
  {
    id: "email-7",
    subject: "Conference Attendance Confirmation",
    from: {
      name: "John Doe",
      email: "john.doe@havenmed.com",
      avatar: "/placeholder.svg"
    },
    to: [
      { name: "Dr. Rajesh Kumar", email: "rajesh.kumar@havenmed.com" }
    ],
    cc: [
      { name: "Human Resources", email: "hr@havenmed.com" }
    ],
    body: `Dear Dr. Kumar,

I am writing to confirm my attendance at the Annual Medical Innovation Conference in Mumbai next month (August 15-17).

As discussed, I will be presenting our research on "Emerging Trends in Telemedicine Adoption in Rural India" on the second day of the event.

I have also attached my presentation draft for your review. Any feedback would be appreciated before I finalize it next week.

Best regards,
Dr. John Doe`,
    date: getRelativeDate(10),
    read: true,
    folder: "sent",
    attachments: [
      {
        name: "Telemedicine_Research_Presentation_Draft.pptx",
        size: "4.3MB",
        type: "pptx"
      }
    ]
  },
  {
    id: "email-8",
    subject: "Medical Supplies Order Confirmation",
    from: {
      name: "Medical Supplies Coordinator",
      email: "supplies@havenmed.com"
    },
    to: [
      { name: "John Doe", email: "john.doe@havenmed.com" }
    ],
    body: `Dear Dr. Doe,

This is to confirm that your order for medical supplies has been processed and scheduled for delivery.

Order #: MS-2023-5647
Delivery Date: July 12, 2023

Items:
- Examination gloves (5 boxes)
- Surgical masks (3 boxes)
- Disposable syringes (100 units)
- Blood pressure cuffs (2 units)

If you have any questions or need to modify your order, please contact the supplies department within 24 hours.

Regards,
Medical Supplies Coordinator
Haven Med Hospital`,
    date: getRelativeDate(5),
    read: true,
    folder: "archive"
  },
  {
    id: "email-9",
    subject: "Vacation Request Approved",
    from: {
      name: "Human Resources",
      email: "hr@havenmed.com"
    },
    to: [
      { name: "John Doe", email: "john.doe@havenmed.com" }
    ],
    body: `Dear Dr. Doe,

Your vacation request for July 25-30, 2023 has been approved.

Please ensure that all your patient appointments during this period are rescheduled or covered by another physician. Dr. Meera Gupta has been assigned as your coverage during your absence.

Enjoy your time off!

Best regards,
Human Resources
Haven Med Hospital`,
    date: getRelativeDate(12),
    read: true,
    folder: "archive"
  },
  {
    id: "email-10",
    subject: "Deleted Draft: Patient Treatment Plan",
    from: {
      name: "John Doe",
      email: "john.doe@havenmed.com",
      avatar: "/placeholder.svg"
    },
    to: [
      { name: "Dr. Amit Patel", email: "amit.patel@havenmed.com" }
    ],
    body: `[DRAFT]

Dear Dr. Patel,

I wanted to share my thoughts on the treatment plan for our shared patient, Mr. Sharma.

Given his recent test results, I believe we should consider...

[This draft was deleted before completion]`,
    date: getRelativeDate(20),
    read: true,
    folder: "trash"
  },
];
