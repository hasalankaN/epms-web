// Types for Course Structure section

export interface LessonMaterial {
  id: string;
  uploadedDate: string;
  title: string;
  type: "Link" | "File";
  format: "Youtube" | "PPTX" | "DOC" | "CSV" | "PDF" | "MP4";
}

export interface Lesson {
  id: string;
  title: string;
  isActive: boolean;
  videoCount: number;
  materialCount: number;
  materials: LessonMaterial[];
}

export interface Week {
  id: string;
  title: string;
  lessons: Lesson[];
}
