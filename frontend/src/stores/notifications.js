import { defineStore } from 'pinia';

/**
 * Notifications store — holds the transient toast driven by the
 * `new_adoption_alert` WebSocket event. Rendered by ToastNotification.vue.
 */
export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    /** @type {string | null} */
    current: null,
    /** @type {ReturnType<typeof setTimeout> | null} */
    _timeoutId: null,
  }),

  actions: {
    /** @param {{ name: string, species: string }} pet */
    pushAdoptionAlert(pet) {
      this.current = `New pet up for adoption: ${pet.name} the ${pet.species}!`;
      if (this._timeoutId) clearTimeout(this._timeoutId);
      this._timeoutId = setTimeout(() => {
        this.current = null;
        this._timeoutId = null;
      }, 5000);
    },

    clear() {
      this.current = null;
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
      }
    },
  },
});
