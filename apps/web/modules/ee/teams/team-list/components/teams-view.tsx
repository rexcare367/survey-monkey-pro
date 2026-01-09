import { TOrganizationRole } from "@formbricks/types/memberships";
import { SettingsCard } from "@/app/(app)/environments/[environmentId]/settings/components/SettingsCard";
import { getTranslate } from "@/lingodotdev/server";
import { TeamsTable } from "@/modules/ee/teams/team-list/components/teams-table";
import { getProjectsByOrganizationId } from "@/modules/ee/teams/team-list/lib/project";
import { getTeams } from "@/modules/ee/teams/team-list/lib/team";
import { getMembersByOrganizationId } from "@/modules/organization/settings/teams/lib/membership";

interface TeamsViewProps {
  organizationId: string;
  membershipRole?: TOrganizationRole;
  currentUserId: string;
  isAccessControlAllowed: boolean;
  environmentId: string;
}

export const TeamsView = async ({ organizationId, membershipRole, currentUserId }: TeamsViewProps) => {
  const t = await getTranslate();

  const [teams, orgMembers, orgProjects] = await Promise.all([
    getTeams(currentUserId, organizationId),
    getMembersByOrganizationId(organizationId),
    getProjectsByOrganizationId(organizationId),
  ]);

  if (!teams) {
    throw new Error(t("common.teams_not_found"));
  }

  return (
    <SettingsCard
      title={t("environments.settings.teams.teams")}
      description={t("environments.settings.teams.teams_description")}>
      <TeamsTable
        teams={teams}
        membershipRole={membershipRole}
        organizationId={organizationId}
        orgMembers={orgMembers}
        orgProjects={orgProjects}
        currentUserId={currentUserId}
      />
    </SettingsCard>
  );
};
