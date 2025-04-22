export interface Event {
    id: number;
    title: string;
    description: string;
    start_date: string;
    status: 'ongoing' | 'draft' | 'completed';
    image?: string;
  }
  
export interface Comment {
    id: number;
    content: string;
    username?: string;
    created_at: string;
    avatar?: string;
  }
  
export interface Collaborator {
    id: number;
    user_id: number;
    role: string;
    status: string;
    avatar?: string;
    name?: string;
  }
  
export interface Partner {
    id: number;
    client_id: number;
    full_name: string;
    description: string;
    offered_help?: string;
    logo?: string;
  }
  