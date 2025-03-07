export interface Job {
  id: number;
  title: string;
  subtitle: string;
  logo: string; // Now a file path or URL (e.g., "uploads/logo-123.png")
  bgColor: string;
  details: {
    time: string;
    level: string;
    experience: string;
    salary: string;
    overview: string;
    description: string[];
  };
}