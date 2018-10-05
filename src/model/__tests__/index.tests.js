import Model, { priorityValues } from '..';

const getProcessor = () => ({ test: () => {}, process: () => {} });

let store;
beforeEach(() => {
  store = Model.create({});
});

describe('H2R Store', () => {
  test('priority values are correct', () => {
    expect(priorityValues).toMatchSnapshot();
  });
  test('add processor with priority (number)', () => {
    store.addProcessor(getProcessor(), 11);
    expect(store.processors).toHaveLength(1);
    expect(store.processors[0].priority).toBe(11);
  });
  test('add processor with priority (low)', () => {
    store.addProcessor(getProcessor(), 'low');
    expect(store.processors).toHaveLength(1);
    expect(store.processors[0].priority).toBe(priorityValues.low);
  });
  test('add processor with priority (medium)', () => {
    store.addProcessor(getProcessor(), 'medium');
    expect(store.processors).toHaveLength(1);
    expect(store.processors[0].priority).toBe(priorityValues.medium);
  });
  test('add processor with priority (high)', () => {
    store.addProcessor(getProcessor(), 'high');
    expect(store.processors).toHaveLength(1);
    expect(store.processors[0].priority).toBe(priorityValues.high);
  });
  test('add processor with wrong priority (string)', () => {
    store.addProcessor(getProcessor(), 'top');
    expect(store.processors).toHaveLength(1);
    expect(store.processors[0].priority).toBe(priorityValues.low);
  });
  test('add processor without priority (default value)', () => {
    store.addProcessor(getProcessor());
    expect(store.processors).toHaveLength(1);
    expect(store.processors[0].priority).toBe(priorityValues.low);
  });
  test('add same processor with different priorities', () => {
    const proc = getProcessor();
    store.addProcessor(proc, 'high');
    store.addProcessor(proc, 'low');

    const { processors: procs } = store;

    expect(procs).toHaveLength(2);
    expect(procs[0].priority).toBe(priorityValues.high);
    expect(procs[1].priority).toBe(priorityValues.low);
    expect(procs[0].test).toBe(procs[1].test);
    expect(procs[0].process).toBe(procs[1].process);
  });
  test('get processors ordered by priority', () => {
    const processorLow = getProcessor();
    const processorHigh = getProcessor();
    const processor21 = getProcessor();
    const processor14 = getProcessor();
    const processorMedium = getProcessor();

    store.addProcessor(processorLow, 'low');
    store.addProcessor(processorHigh, 'high');
    store.addProcessor(processor21, 21);
    store.addProcessor(processor14, 14);
    store.addProcessor(processorMedium, 'medium');

    const { processorsByPriority: procs } = store;

    expect(procs).toHaveLength(5);
    expect(procs[0].test).toBe(processorHigh.test);
    expect(procs[0].process).toBe(processorHigh.process);
    expect(procs[1].test).toBe(processor14.test);
    expect(procs[1].process).toBe(processor14.process);
    expect(procs[2].test).toBe(processorMedium.test);
    expect(procs[2].process).toBe(processorMedium.process);
    expect(procs[3].test).toBe(processor21.test);
    expect(procs[3].process).toBe(processor21.process);
    expect(procs[4].test).toBe(processorLow.test);
    expect(procs[4].process).toBe(processorLow.process);
  });
  test('maintain insertion order for processors with same priority', () => {
    // Generate six processors
    const processors = Array(6)
      .fill(0)
      .map(getProcessor);

    // Array of priorities
    const priorities = [30, 30, 20, 20, 10, 10];

    // Add processors with their respective priority
    processors.forEach((proc, i) => {
      store.addProcessor(proc, priorities[i]);
    });

    const [
      processorLow1,
      processorLow2,
      processorMedium1,
      processorMedium2,
      processorHigh1,
      processorHigh2,
    ] = processors;

    const { processorsByPriority: sorted } = store;

    expect(sorted).toHaveLength(6);

    expect(sorted[0].test).toBe(processorHigh1.test);
    expect(sorted[0].process).toBe(processorHigh1.process);
    expect(sorted[1].test).toBe(processorHigh2.test);
    expect(sorted[1].process).toBe(processorHigh2.process);
    expect(sorted[2].test).toBe(processorMedium1.test);
    expect(sorted[2].process).toBe(processorMedium1.process);
    expect(sorted[3].test).toBe(processorMedium2.test);
    expect(sorted[3].process).toBe(processorMedium2.process);
    expect(sorted[4].test).toBe(processorLow1.test);
    expect(sorted[4].process).toBe(processorLow1.process);
    expect(sorted[5].test).toBe(processorLow2.test);
    expect(sorted[5].process).toBe(processorLow2.process);
  });
});
