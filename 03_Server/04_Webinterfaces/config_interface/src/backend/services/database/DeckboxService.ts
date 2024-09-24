import { db } from "../../db";

/**
 * Service class for handling Deckbox-related operations.
 */
export class DeckboxService {
  /**
   * Retrieves combined deckbox data by performing a left join on multiple tables.
   * @returns {Promise<CombinedDeckboxData[]>} - Array of combined deckbox data records.
   */
  async getCombindedDeckboxData() {
    const result = await db
      .selectFrom("DeckUnit as deckunit")
      .leftJoin("PlatformContainsDeckUnit", "PlatformContainsDeckUnit.deck_unit_id", "deckunit.deck_unit_id")
      .leftJoin("Platform", "PlatformContainsDeckUnit.platform_id", "Platform.platform_id")
      .leftJoin("PlatformContainsLogger", "Platform.platform_id", "PlatformContainsLogger.platform_id")
      .leftJoin("DeckUnit", "deckunit.deck_unit_id", "DeckUnit.deck_unit_id")
      .selectAll()
      .orderBy("PlatformContainsDeckUnit.time_start", "desc")
      .execute();
    return result;
  }
}

export type CombinedDeckboxData = Awaited<ReturnType<DeckboxService["getCombindedDeckboxData"]>>[number];
