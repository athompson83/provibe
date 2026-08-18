export interface DatabaseColumn { schema: string; table: string; name: string; dataType: string; nullable: boolean; }
export interface DatabaseTable { schema: string; name: string; rlsEnabled: boolean; columns: DatabaseColumn[]; }
export interface ProviderFinding { id: string; severity: 'info' | 'warning' | 'error'; title: string; description: string; }
export interface DatabaseProvider {
  getSchemaMetadata(projectId: string): Promise<DatabaseTable[]>;
  getSecurityFindings(projectId: string): Promise<ProviderFinding[]>;
  getPerformanceFindings(projectId: string): Promise<ProviderFinding[]>;
}
