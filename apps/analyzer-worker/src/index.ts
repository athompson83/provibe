export interface AnalysisJob { workspaceId: string; projectId: string; repository: string; commitSha: string; }
export interface AnalysisResult { repository: string; commitSha: string; analyzerVersion: string; factsEmitted: number; warnings: string[]; }

/** Repository materialization/parsing belongs here, never in the web runtime. Treat repository contents as hostile data and never execute repository code. */
export async function analyzeJob(job: AnalysisJob): Promise<AnalysisResult> {
  return { repository: job.repository, commitSha: job.commitSha, analyzerVersion: 'foundation-0.1.0', factsEmitted: 0, warnings: ['AST pipeline is not connected in the foundation release.'] };
}
