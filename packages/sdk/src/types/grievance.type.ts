
export type GrievanceStatus = 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';

export const GrievanceStatus = {
  NEW: 'NEW' as GrievanceStatus,
  UNDER_REVIEW: 'UNDER_REVIEW' as GrievanceStatus,
  RESOLVED: 'RESOLVED' as GrievanceStatus,
  CLOSED: 'CLOSED' as GrievanceStatus
}

export type GrievanceType = 'TECHNICAL' | 'NON_TECHNICAL' | 'OTHER';

export const GrievanceType = {
  TECHNICAL: 'TECHNICAL' as GrievanceType,
  NON_TECHNICAL: 'NON_TECHNICAL' as GrievanceType,
  OTHER: 'OTHER' as GrievanceType
}

export type Grievance = {
  id?: number;
  reportedBy: string;
  reporterUserId?: number;
  reporterContact: string;
  title: string;
  type: GrievanceType;
  projectId: string;
  description: string;
  status: GrievanceStatus;
  createdAt?: Date;
  updatedAt?: Date;
  project?: {
    name: string;
    uuid: string;
  };
  reporterUser?: {
    name: string;
    uuid: string;
    id: number;
  };

}
