/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import { types } from 'mobx-state-tree';
import { sortBy } from 'lodash-es';

export const priorityValues = {
  high: 10,
  medium: 20,
  low: 30,
};

export default types
  .model('h2r')
  .volatile(() => ({
    processors: [],
  }))
  .views(self => ({
    get processorsByPriority() {
      return sortBy(self.processors, [({ priority }) => priority]);
    },
  }))
  .actions(self => ({
    addProcessor(processor, priority = 'low', options = {}) {
      let priorityValue;
      if (typeof priority === 'string') {
        priorityValue = priorityValues[priority];
      } else if (typeof priority === 'number') {
        priorityValue = priority;
      }

      if (!priorityValue) {
        priorityValue = priorityValues.low;
        console.warn(
          `Wrong priority value (${priority}) for a processor. Must be a number, 'high', 'medium' or 'low'. Setting priority to 'low'.`,
        );
      }

      self.processors.push({ priority: priorityValue, options, ...processor });
    },
  }));
