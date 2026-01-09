"use server";

import { z } from "zod";
import { createMembership } from "@/lib/membership/service";
import { createOrganization } from "@/lib/organization/service";
import { authenticatedActionClient } from "@/lib/utils/action-client";
import { AuthenticatedActionClientCtx } from "@/lib/utils/action-client/types/context";
import { withAuditLogging } from "@/modules/ee/audit-logs/lib/handler";

const ZCreateOrganizationAction = z.object({
  organizationName: z.string(),
});

export const createOrganizationAction = authenticatedActionClient.schema(ZCreateOrganizationAction).action(
  withAuditLogging(
    "created",
    "organization",
    async ({ ctx, parsedInput }: { ctx: AuthenticatedActionClientCtx; parsedInput: Record<string, any> }) => {
      const newOrganization = await createOrganization({
        name: parsedInput.organizationName,
      });

      await createMembership(newOrganization.id, ctx.user.id, {
        role: "owner",
        accepted: true,
      });

      ctx.auditLoggingCtx.organizationId = newOrganization.id;
      ctx.auditLoggingCtx.newObject = newOrganization;

      return newOrganization;
    }
  )
);
