import React from 'react';
import { render } from '@testing-library/react-native';
import { ChinaConnectionMap } from '../../components/ChinaConnectionMap';
import chinaGeo from '../../data/chinaGeo.json';
import { normalizeProvinceId } from '../../utils/provinceIds';

describe('ChinaConnectionMap', () => {
  it('every chinaGeo province id normalizes to itself (no dead aliases)', () => {
    for (const f of chinaGeo.features) {
      expect(normalizeProvinceId(f.properties.id)).toBe(f.properties.id);
    }
  });

  it('renders without crashing', () => {
    expect(() =>
      render(<ChinaConnectionMap connectedProvinces={new Set(['Shaanxi', 'Henan'])} />)
    ).not.toThrow();
  });
});
