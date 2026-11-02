// Builds site/leaflet-text/<slug>.json from compact specs (specs.js): shared leaflet
// boilerplate lives in BASES so each product spec only carries its own text.
// Usage: node gen.js <site-dir>
const fs = require('fs'), path = require('path');
const site = process.argv[2];
const { BASES, SPECS } = require('./specs.js');
const ORDER = ['tagline', 'badges', 'highlights', 'description', 'composition', 'chemistry', 'action', 'indications', 'dosage', 'course', 'contraindications', 'side_effects', 'dispensing', 'storage', 'shelf_life', 'release_form', 'manufacturer', 'approval'];
const ordered = o => Object.fromEntries(ORDER.filter(k => o[k] != null && o[k] !== '').map(k => [k, o[k]]));
let n = 0;
for (const [slug, spec] of Object.entries(SPECS)) {
  const base = spec.base ? BASES[spec.base] : { kr: {}, ru: {} };
  if (spec.base && !base) throw new Error(slug + ': unknown base ' + spec.base);
  const out = { source: 'Асл буклетдан кўчирилган (' + spec.src + ')' };
  if (spec.notes) out.notes = spec.notes;
  for (const lang of ['kr', 'ru']) {
    const merged = Object.assign({}, base[lang], spec[lang] || {});
    // dosage: base intro + product-specific lines
    if (base[lang] && base[lang].dosage_intro && spec[lang] && spec[lang].dose) merged.dosage = base[lang].dosage_intro + '\n' + spec[lang].dose;
    delete merged.dosage_intro; delete merged.dose;
    if (Object.keys(merged).length) out[lang] = ordered(merged);
  }
  fs.writeFileSync(path.join(site, 'leaflet-text', slug + '.json'), JSON.stringify(out, null, 2) + '\n');
  n++;
}
console.log('written', n);
