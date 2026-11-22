// Sätteri hast plugin (Astro's Markdown processor, also used for MDX): links that leave the site open in
// a new tab. Internal links (/series/…, #footnotes) are left alone. Runs at build time.
export default {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      if (/^https?:\/\//.test(String(node.properties?.href ?? ''))) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', ['noopener', 'noreferrer']);
      }
    },
  },
};
