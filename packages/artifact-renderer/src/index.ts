export interface RenderArtifactInput {
  title: string;
  revision: number;
  generatedAt: string;
  body: string;
}

export function renderArtifact(input: RenderArtifactInput): string {
  return `---\ncanonical_revision: ${input.revision}\ngenerated_at: ${input.generatedAt}\n---\n\n# ${input.title}\n\n${input.body.trim()}\n`;
}
