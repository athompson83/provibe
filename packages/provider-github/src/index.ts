export interface RepositoryRef { owner: string; name: string; defaultBranch: string; }
export interface TreeEntry { path: string; kind: 'file' | 'directory'; sha: string; }
export interface FileBlob { path: string; sha: string; text: string; }
export interface ChangedFile { path: string; status: 'added' | 'modified' | 'removed' | 'renamed'; }
export interface SourceProvider {
  listRepositories(): Promise<RepositoryRef[]>;
  getTree(repository: RepositoryRef, ref: string): Promise<TreeEntry[]>;
  getFile(repository: RepositoryRef, path: string, ref: string): Promise<FileBlob>;
  getChangedFiles(repository: RepositoryRef, base: string, head: string): Promise<ChangedFile[]>;
}
