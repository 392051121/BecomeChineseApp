import { navigateApp } from '../../utils/navigation';

function makeNav({ routeNames = [], parent = null, navigate = jest.fn() } = {}) {
  return {
    navigate,
    getState: () => ({ routeNames }),
    getParent: () => parent,
  };
}

describe('navigateApp', () => {
  it('navigates directly when current navigator owns the route (Places tab → Food)', () => {
    const navigate = jest.fn();
    const nav = makeNav({
      routeNames: ['Home', 'Seasons', 'History', 'Food', 'Places', 'Profile'],
      navigate,
    });
    const ok = navigateApp(nav, 'Food', { recipeId: 'r1' });
    expect(ok).toBe(true);
    expect(navigate).toHaveBeenCalledWith('Food', { recipeId: 'r1' });
  });

  it('climbs to parent when stack does not own tab route', () => {
    const tabNavigate = jest.fn();
    const tab = makeNav({
      routeNames: ['Home', 'Seasons', 'History', 'Food', 'Places', 'Profile'],
      navigate: tabNavigate,
    });
    const stack = makeNav({
      routeNames: ['HistoryHome', 'DynastyDetail', 'PersonDetail'],
      parent: tab,
      navigate: jest.fn(),
    });
    const ok = navigateApp(stack, 'Food', { recipeId: 'r2' });
    expect(ok).toBe(true);
    expect(tabNavigate).toHaveBeenCalledWith('Food', { recipeId: 'r2' });
    expect(stack.navigate).not.toHaveBeenCalled();
  });

  it('falls back to caller navigate when no owner found', () => {
    const navigate = jest.fn();
    const nav = makeNav({ routeNames: ['OnlyA'], navigate });
    const ok = navigateApp(nav, 'Missing', { x: 1 });
    expect(ok).toBe(true);
    expect(navigate).toHaveBeenCalledWith('Missing', { x: 1 });
  });

  it('returns false for null navigation', () => {
    expect(navigateApp(null, 'Food')).toBe(false);
  });
});
