import * as turf from '@turf/turf';
import { sitesSetCurrent } from './sites';
import { treesSetCurrent } from "./trees";

export const MAP_SET_CENTER = 'MAP_SET_CENTER';
export const MAP_SET_ZOOM = 'MAP_SET_ZOOM';

export function mapSetCenter(center) {
  return {
    type: MAP_SET_CENTER,
    center
  };
}

export function mapSetZoom(zoom) {
  return {
    type: MAP_SET_ZOOM,
    zoom
  };
}

function getSiteTrees(trees, id) {
  return trees.ids.map(id => trees.byId[id])
        .filter(tree => tree.site_id === id);
}

export function centerMapOnSite(id) {
  return (dispatch, getState) => {
    const { top, right, bottom, left } = getState().sites.byId[id].bounding;
    const features = turf.featureCollection([
      turf.point([Number(left), Number(top)]),
      turf.point([Number(right), Number(top)]),
      turf.point([Number(right), Number(bottom)])
    ]);

    const siteTrees = getSiteTrees(getState().trees, id);

    dispatch(treesSetCurrent(siteTrees));
    dispatch(sitesSetCurrent(id));
    dispatch(mapSetCenter(turf.center(features).geometry.coordinates));
    dispatch(mapSetZoom(initial.zoom));
  };
}

const initial = {
  center: [-123.1939435, 49.2578263],
  zoom: 15
};

const reducer = {
  [MAP_SET_CENTER](state, action) {
    return {
      ...state,
      center: action.center
    };
  },
  [MAP_SET_ZOOM](state, action) {
    return {
      ...state,
      zoom: action.zoom
    };
  }
};

export default (state = initial, action) => reducer.hasOwnProperty(action.type) ? reducer[action.type](state, action) : state;
