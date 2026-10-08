import { api } from '@/services/api';
import { KnowledgeMapView } from '@/components/knowledge-map/KnowledgeMapView';

export const metadata = {
  title: 'Knowledge Map | Neuronotes',
  description: 'Interactive prerequisite dependency DAG and concept state inspector',
};

export default async function KnowledgeMapPage() {
  const [concepts, graphData] = await Promise.all([
    api.getConcepts(),
    api.getDependencyGraph()
  ]);

  return <KnowledgeMapView concepts={concepts} initialGraphData={graphData} />;
}
