export interface Application {
  id: number;
  jobId: number | null; // Allow null for jobId
  applicantName: string;
  email: string;
  phone: string;
  position: string;
  resume: string;
  coverLetter: string;
  createdAt: Date;
  status: string;
}