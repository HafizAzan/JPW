import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company._id}`} className="group block h-full">
      <Card className="hover-lift h-full">
        <div className="flex items-center gap-3">
          <Avatar name={company.name} src={company.logo?.url} />
          <div>
            <h3 className="font-display text-2xl transition-colors duration-300 group-hover:text-primary">{company.name}</h3>
            <p className="text-sm text-muted-foreground">{company.industry ?? "Company"}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{company.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {company.location ? <Badge>{company.location}</Badge> : null}
          {company.verified ? <Badge tone="forest">Verified</Badge> : null}
        </div>
      </Card>
    </Link>
  );
}
