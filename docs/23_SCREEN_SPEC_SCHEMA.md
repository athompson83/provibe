# Screen Specification Schema

Every generated design visual must have a machine-readable companion screen specification so a coding agent can implement behavior instead of guessing from pixels.

Required fields: screen ID/name, primary objective, route/navigation context, primary/secondary actions, data dependencies, key components, project revision, UI states and evidence-status usage.

Required UI states: loading, empty, error, unauthorized, partial data and success. Include first-use/offline/disconnected when applicable.

Responsive specification describes desktop/tablet/mobile behavior. Accessibility specifies keyboard behavior, semantic labeling, contrast/state requirements and nonvisual alternatives for complex graphs.

Baseline JSON Schema: `schemas/screen-spec.schema.json`.
