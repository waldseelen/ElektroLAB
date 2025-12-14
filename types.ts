export interface Topology {
  name: string;
  notes: string;
  pros: string[];
  cons: string[];
}

export interface FailureMode {
  title: string;
  symptoms: string[];
  root_causes: string[];
  checks: string[];
  related_topologies: string[];
}

export interface Module {
  id: string;
  name: string;
  summary: string;
  blocks: string[];
  topologies: Topology[];
  typical_components: string[];
  typical_ic_families: string[];
  failure_modes: FailureMode[];
  safety_notes: string[];
  references: string[];
}

export interface BlockNode {
  id: string;
  label: string;
  type: 'source' | 'process' | 'control' | 'actuator' | 'sensor';
  moduleId: string | null;
}

export interface BlockEdge {
  from: string;
  to: string;
  label: string;
}

export interface BlockDiagramData {
  nodes: BlockNode[];
  edges: BlockEdge[];
}

export interface FailureScenario {
  title: string;
  symptoms: string[];
  likely_modules: string[];
  likely_components: string[];
  notes: string;
}

export interface ModuleMapItem {
  moduleId: string;
  role: string;
}

export interface Device {
  id: string;
  name: string;
  category: string;
  tags: string[];
  overview: string;
  imageUrl: string;
  working_principle: string[]; // Step-by-step engineering explanation
  module_map: ModuleMapItem[];
  block_diagram?: BlockDiagramData;
  topologies_used: string[];
  typical_components: string[];
  typical_ic_families: string[];
  failure_scenarios: FailureScenario[];
  learning_notes: {
    what_to_learn: string[];
    common_misconceptions: string[];
    practical_insights: string[];
  };
  safety_notes: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  related_ids: string[];
}