export interface Application {
  id: number;
  jobId: number;
  applicantName: string;
  email: string;
  phone: string;
  position: string;
  resume: string;
  coverLetter: string;
  createdAt: Date;
}