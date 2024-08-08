import { CombinedDeckboxData } from "../../../backend/services/database/DeckboxService";

const apiPath: string = "/api/deckbox/";
/**
 * Service class for managing deckbox data.
 */
export class DeckboxService {
  /**
   * Retrieves combined deckbox data.
   * @returns {Promise<CombinedDeckboxData[]>} - A promise that resolves to the result of the API call.
   */
  async getCombindedDeckboxData() {
    const res = await fetch(apiPath + "getCombindedDeckboxData").then((data) => data.json());
    const reducedArray = res.reduce((accumulator: CombinedDeckboxData[], current: CombinedDeckboxData) => {
      if (!accumulator.find((item) => item.deck_unit_id === current.deck_unit_id)) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);

    reducedArray.sort((a: CombinedDeckboxData, b: CombinedDeckboxData) => {
      if (a.deck_unit_id && b.deck_unit_id) return a.deck_unit_id - b.deck_unit_id;
    });
    return reducedArray;
  }
}
