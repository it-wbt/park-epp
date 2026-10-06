/** Illustrative timings, not machine cycle settings or production parameters. */
export const eppProcess = [
  {start: 0, end: 2, name: 'Expanded EPP beads', short: 'Beads', detail: 'Lightweight foam beads enter the feed system.'},
  {start: 2, end: 7, name: 'Filling the mould', short: 'Fill', detail: 'Air carries the beads through the fill gun into the mould cavity.'},
  {start: 7, end: 11.5, name: 'Steam fusion', short: 'Fuse', detail: 'Steam bonds the beads into the shape of the component.'},
  {start: 11.5, end: 15.5, name: 'Cooling & stabilising', short: 'Cool', detail: 'The component cools while the mould stays closed.'},
  {start: 15.5, end: 19, name: 'Opening the mould', short: 'Open', detail: 'The tool opens to reveal the moulded foam component.'},
  {start: 19, end: 24, name: 'Releasing the product', short: 'Release', detail: 'Ejectors and a gripper transfer the component to the outfeed.'},
] as const;

export const getEppProcessStep = (seconds: number) => {
  const index = eppProcess.findIndex(step => seconds >= step.start && seconds < step.end);
  return index < 0 ? 0 : index;
};
