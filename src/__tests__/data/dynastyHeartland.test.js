/**
 * Dynasty heartland multi-province auto-fill
 */
import { dynasties } from '../../data/dynasties';
import {
  getDynastyHeartlandProvinces,
  dynastyHeartlandMap,
} from '../../data/relations';
import chinaGeo from '../../data/chinaGeo.json';

const geoIds = new Set(chinaGeo.features.map((f) => f.properties.id));

describe('dynasty heartland provinces', () => {
  it('exports curated map for all main dynasties', () => {
    expect(Object.keys(dynastyHeartlandMap).length).toBeGreaterThanOrEqual(13);
  });

  it('all curated province ids exist in chinaGeo', () => {
    for (const [dynastyId, provinces] of Object.entries(dynastyHeartlandMap)) {
      for (const id of provinces) {
        expect(geoIds.has(id)).toBe(true);
      }
    }
  });

  it('getDynastyHeartlandProvinces returns multi-province sets', () => {
    const zhou = getDynastyHeartlandProvinces('zhou', 'Shaanxi');
    expect(zhou).toEqual(expect.arrayContaining(['Shaanxi', 'Henan', 'Shandong']));
    expect(zhou.length).toBeGreaterThanOrEqual(3);

    const three = getDynastyHeartlandProvinces('three-kingdoms', 'General');
    expect(three).toEqual(expect.arrayContaining(['Hubei', 'Sichuan', 'Chongqing']));
    expect(three.length).toBeGreaterThanOrEqual(3);
  });

  it('dynasty objects carry non-empty heartlandProvinces', () => {
    for (const d of dynasties) {
      expect(Array.isArray(d.heartlandProvinces)).toBe(true);
      expect(d.heartlandProvinces.length).toBeGreaterThan(0);
      for (const id of d.heartlandProvinces) {
        expect(geoIds.has(id)).toBe(true);
      }
    }
  });

  it('zhou has more than a single capital province', () => {
    const zhou = dynasties.find((d) => d.id === 'zhou');
    expect(zhou).toBeDefined();
    expect(zhou.heartlandProvinces.length).toBeGreaterThan(1);
  });
});
