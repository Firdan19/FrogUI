export type FrogAgentEventType =
  | 'queued'
  | 'gateway'
  | 'memory'
  | 'inference'
  | 'complete'
  | 'final'
  | 'error';

export interface FrogAgentCommand {
  command: string;
}

export interface FrogAgentTask {
  task_id: string;
  status: 'queued';
  stream_url: string;
}

export interface FrogAgentEvent {
  task_id: string;
  type: FrogAgentEventType;
  content: string;
}

