import { PageHeader } from '@/components/PageHeader';
import { ExperienceCard } from '@/components/ExperienceCard';
import { experiences } from '@/data/content';

export function ExperiencesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Vivir la ciudad"
        title="Experiencias"
        description="Propuestas gastronómicas, culturales y cotidianas para conocer las costumbres y la identidad de Sevilla. No es solo qué ver: es cómo se vive."
      />

      <div className="container-page pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </div>
  );
}
