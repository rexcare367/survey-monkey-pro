import { ContactsSecondaryNavigation } from "@/modules/ee/contacts/components/contacts-secondary-navigation";
import { getContactAttributeKeys } from "@/modules/ee/contacts/lib/contact-attribute-keys";
import { SegmentTable } from "@/modules/ee/contacts/segments/components/segment-table";
import { getSegments } from "@/modules/ee/contacts/segments/lib/segments";
import { getIsContactsEnabled } from "@/modules/ee/license-check/lib/utils";
import { getEnvironmentAuth } from "@/modules/environments/lib/utils";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";
import { CreateSegmentModal } from "./components/create-segment-modal";

export const SegmentsPage = async ({
  params: paramsProps,
}: {
  params: Promise<{ environmentId: string }>;
}) => {
  const params = await paramsProps;

  const { isReadOnly } = await getEnvironmentAuth(params.environmentId);

  const [segments, contactAttributeKeys] = await Promise.all([
    getSegments(params.environmentId),
    getContactAttributeKeys(params.environmentId),
  ]);

  const isContactsEnabled = await getIsContactsEnabled();

  if (!segments) {
    throw new Error("Failed to fetch segments");
  }

  const filteredSegments = segments.filter((segment) => !segment.isPrivate);

  return (
    <PageContentWrapper>
      <PageHeader
        pageTitle="Contacts"
        cta={
          isContactsEnabled && !isReadOnly ? (
            <CreateSegmentModal
              environmentId={params.environmentId}
              contactAttributeKeys={contactAttributeKeys}
              segments={filteredSegments}
            />
          ) : undefined
        }>
        <ContactsSecondaryNavigation activeId="segments" environmentId={params.environmentId} />
      </PageHeader>

      <SegmentTable
        segments={filteredSegments}
        contactAttributeKeys={contactAttributeKeys}
        isContactsEnabled={isContactsEnabled}
        isReadOnly={isReadOnly}
      />
    </PageContentWrapper>
  );
};
