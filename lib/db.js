import { INITIAL_MENUS, INITIAL_REVIEWS, INITIAL_VOTES } from './initial-data';

// Helper for Cloudflare D1 database layer
export class D1Client {
  constructor(env) {
    this.d1 = env?.DB || null;
  }

  async getMenus(date) {
    if (this.d1) {
      try {
        const query = date 
          ? "SELECT * FROM menus WHERE date = ? ORDER BY created_at DESC" 
          : "SELECT * FROM menus ORDER BY created_at DESC";
        const stmt = date ? this.d1.prepare(query).bind(date) : this.d1.prepare(query);
        const { results } = await stmt.all();
        return results;
      } catch (err) {
        console.error("D1 Error fetching menus:", err);
      }
    }
    return INITIAL_MENUS;
  }

  async getReviews(menuId) {
    if (this.d1) {
      try {
        const query = menuId 
          ? "SELECT * FROM reviews WHERE menu_id = ? ORDER BY created_at DESC" 
          : "SELECT * FROM reviews ORDER BY created_at DESC";
        const stmt = menuId ? this.d1.prepare(query).bind(menuId) : this.d1.prepare(query);
        const { results } = await stmt.all();
        return results;
      } catch (err) {
        console.error("D1 Error fetching reviews:", err);
      }
    }
    return INITIAL_REVIEWS;
  }

  async insertReview(reviewData) {
    if (this.d1) {
      try {
        const { id, menu_id, menu_name, taste_score, hygiene_score, portion_score, value_score, overall_score, employee_name, department, is_anonymous, comment, tags, photo_url, date } = reviewData;
        await this.d1.prepare(`
          INSERT INTO reviews (id, menu_id, menu_name, taste_score, hygiene_score, portion_score, value_score, overall_score, employee_name, department, is_anonymous, comment, tags, photo_url, date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, menu_id, menu_name, taste_score, hygiene_score, portion_score, value_score, overall_score, employee_name, department, is_anonymous ? 1 : 0, comment, typeof tags === 'string' ? tags : JSON.stringify(tags), photo_url || null, date).run();
        return { success: true, id };
      } catch (err) {
        console.error("D1 Error inserting review:", err);
        throw err;
      }
    }
    return { success: true, simulated: true };
  }
}

// Client-side local storage helper for interactive offline-first state
export const StorageKeys = {
  MENUS: 'canteen_menus_v1',
  REVIEWS: 'canteen_reviews_v1',
  VOTES: 'canteen_votes_v1',
  USER_VOTED_IDS: 'canteen_user_voted_ids_v1',
  HELPFUL_REVIEWS: 'canteen_helpful_reviews_v1'
};
