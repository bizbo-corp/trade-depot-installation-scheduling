import { Client } from "@hubspot/api-client";

const hubspotClient = new Client({
  accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
});

/**
 * Upserts a contact in HubSpot (creates if doesn't exist, updates if exists)
 * Returns the HubSpot contact ID
 */
export async function upsertContact(params: {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<string> {
  try {
    const { email, firstName, lastName, phone } = params;

    // First, try to find existing contact by email
    const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
      query: email,
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ" as const,
              value: email,
            },
          ],
        },
      ],
      properties: ["email", "hs_object_id"],
      limit: 1,
    });

    const existingContact = searchResponse.results?.[0];
    const contactId = existingContact?.id;

    const properties: Record<string, string> = {
      email,
      firstname: firstName,
      lastname: lastName,
    };

    if (phone) {
      properties.phone = phone;
    }

    if (contactId) {
      // Update existing contact
      await hubspotClient.crm.contacts.basicApi.update(contactId, {
        properties,
      });
      return contactId;
    } else {
      // Create new contact
      const createResponse = await hubspotClient.crm.contacts.basicApi.create({
        properties,
      });
      return createResponse.id;
    }
  } catch (error) {
    console.error("HubSpot upsertContact error:", error);
    // Log detailed error in development
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    throw new Error(
      `Failed to upsert contact in HubSpot: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Updates a contact with UX analysis metadata and area of interest
 */
export async function addAnalysisMetadata(params: {
  contactId: string;
  url: string;
  token: string;
  reportLink: string;
  areaOfInterest: string[];
}): Promise<void> {
  try {
    const { contactId, url, token, reportLink, areaOfInterest } = params;

    // Get existing contact to check current area_of_interest values
    const existingContact = await hubspotClient.crm.contacts.basicApi.getById(
      contactId,
      ["area_of_interest", "ux_analysis_date", "last_ux_analysis_date"]
    );

    const existingAreaOfInterest =
      (existingContact.properties?.area_of_interest as string) || "";
    // HubSpot multi-select fields are comma-separated or semicolon-separated
    const existingValues = existingAreaOfInterest
      ? existingAreaOfInterest.split(/[,;]/).map((v) => v.trim()).filter(Boolean)
      : [];

    // Merge area of interest values (avoid duplicates)
    const mergedAreaOfInterest = Array.from(
      new Set([...existingValues, ...areaOfInterest])
    );

    const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const properties: Record<string, string> = {
      ux_analysis_url: url,
      ux_analysis_date: now,
      ux_analysis_report_link: reportLink,
      ux_analysis_token: token,
      ux_analysis_verified: "false",
      last_ux_analysis_date: now,
      area_of_interest: mergedAreaOfInterest.join(";"), // HubSpot multi-select uses semicolon
    };

    await hubspotClient.crm.contacts.basicApi.update(contactId, {
      properties,
    });
  } catch (error) {
    console.error("HubSpot addAnalysisMetadata error:", error);
    // Log detailed error in development
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    throw new Error(
      `Failed to add analysis metadata in HubSpot: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Logs a UX analysis engagement/activity in HubSpot
 */
export async function logAnalysisEngagement(params: {
  contactId: string;
  url: string;
}): Promise<void> {
  try {
    const { contactId, url } = params;

    // Create a note engagement with association
    const noteResponse = await hubspotClient.crm.objects.notes.basicApi.create({
      properties: {
        hs_note_body: `Requested UX analysis for: ${url}`,
        hs_timestamp: new Date().toISOString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED" as const,
              associationTypeId: 214, // Contact to Note association
            },
          ],
        },
      ],
    });

    // Note: The association is created automatically when creating the note with associations array
    // No need for separate association API call
  } catch (error) {
    console.error("HubSpot logAnalysisEngagement error:", error);
    // Log detailed error in development
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    // Don't throw - engagement logging is non-critical
    console.warn("Failed to log engagement, continuing anyway");
  }
}

/**
 * Updates contact verified status in HubSpot
 */
export async function updateVerificationStatus(params: {
  contactId: string;
  verified: boolean;
}): Promise<void> {
  try {
    const { contactId, verified } = params;

    await hubspotClient.crm.contacts.basicApi.update(contactId, {
      properties: {
        ux_analysis_verified: verified ? "true" : "false",
      },
    });
  } catch (error) {
    console.error("HubSpot updateVerificationStatus error:", error);
    // Log detailed error in development
    if (process.env.NODE_ENV === "development" && error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
    }
    throw new Error(
      `Failed to update verification status in HubSpot: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

