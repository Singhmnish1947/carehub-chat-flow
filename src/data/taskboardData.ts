
import { Task } from "@/types/task";
import { staffMembers } from "./staffData";
import { addDays } from "date-fns";

// Helper function to get dates relative to today
const getRelativeDate = (days: number) => {
  return addDays(new Date(), days).toISOString();
};

export const taskboardData: Task[] = [
  {
    id: "task-1",
    title: "Review patient lab results",
    description: "Review the latest blood test results for patient #12345 and update their medical records accordingly.",
    status: "todo",
    priority: "high",
    dueDate: getRelativeDate(1),
    assignee: staffMembers[0], // Dr. Rajesh Kumar
    tags: ["urgent", "lab-results"]
  },
  {
    id: "task-2",
    title: "Schedule follow-up appointments",
    description: "Schedule follow-up appointments for patients who were discharged last week.",
    status: "todo",
    priority: "medium",
    dueDate: getRelativeDate(2),
    assignee: staffMembers[3], // Nurse Anika Singh
    tags: ["follow-up", "appointments"]
  },
  {
    id: "task-3",
    title: "Order medication supplies",
    description: "Place orders for medications that are running low in the inventory.",
    status: "todo",
    priority: "medium",
    dueDate: getRelativeDate(3),
    assignee: staffMembers[3], // Nurse Anika Singh
    tags: ["inventory", "medication"]
  },
  {
    id: "task-4",
    title: "Patient consultation - Mrs. Desai",
    description: "Pre-surgery consultation with Mrs. Desai regarding upcoming heart procedure.",
    status: "in-progress",
    priority: "high",
    dueDate: getRelativeDate(0),
    assignee: staffMembers[0], // Dr. Rajesh Kumar
    tags: ["consultation", "pre-surgery"]
  },
  {
    id: "task-5",
    title: "Update treatment protocols",
    description: "Review and update the treatment protocols for pediatric patients with respiratory conditions.",
    status: "in-progress",
    priority: "medium",
    dueDate: getRelativeDate(5),
    assignee: staffMembers[4], // Dr. Suresh Reddy
    tags: ["protocols", "pediatric"]
  },
  {
    id: "task-6",
    title: "Staff training on new MRI machine",
    description: "Conduct training session for radiology staff on the newly installed MRI machine.",
    status: "in-progress",
    priority: "medium",
    dueDate: getRelativeDate(2),
    assignee: staffMembers[1], // Dr. Priya Sharma
    tags: ["training", "equipment"]
  },
  {
    id: "task-7",
    title: "Prepare monthly department report",
    description: "Compile statistics and prepare the monthly report for the cardiology department.",
    status: "completed",
    priority: "low",
    dueDate: getRelativeDate(-1),
    assignee: staffMembers[0], // Dr. Rajesh Kumar
    tags: ["report", "cardiology"]
  },
  {
    id: "task-8",
    title: "Follow up on insurance claims",
    description: "Contact insurance providers regarding pending claims for patient treatments.",
    status: "completed",
    priority: "medium",
    dueDate: getRelativeDate(-2),
    assignee: staffMembers[3], // Nurse Anika Singh
    tags: ["insurance", "billing"]
  },
  {
    id: "task-9",
    title: "Organize vaccination drive",
    description: "Plan and organize a community vaccination drive for the upcoming weekend.",
    status: "completed",
    priority: "high",
    dueDate: getRelativeDate(-3),
    assignee: staffMembers[4], // Dr. Suresh Reddy
    tags: ["community", "vaccination"]
  }
];
