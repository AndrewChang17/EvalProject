import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as turf from '@turf/turf';

import Map, { Layer, Sources, GeoJSON } from '../components/map';

import { centerMapOnSite, mapSetCenter, mapSetZoom } from '../model/map';

class InteractiveMap extends Component {
  render() {
    const { bounding } = this.props.currentSite;
    const siteTrees = this.props.siteTrees;
    
    const boundingFeature = turf.polygon([[
      [bounding.left, bounding.top],
      [bounding.right, bounding.top],
      [bounding.right, bounding.bottom],
      [bounding.left, bounding.bottom],
      [bounding.left, bounding.top]
    ]], { name: 'Bounding Area' });

      const points = siteTrees.map(tree => turf.point([Number(tree.long), Number(tree.lat)], {height: tree.height}));
      const treesFeatures = turf.featureCollection(points);

      return (
      <Map { ...this.props }>
        <Sources>
          <GeoJSON id="bounding-box" data={ boundingFeature } />
            <GeoJSON id="transparent-layer" data={ boundingFeature } />
            <GeoJSON id="trees-layer" data={ treesFeatures } />
        </Sources>
        <Layer
          id="bounding-box"
          type="line"
          paint={{
            'line-width': 2,
            'line-color': '#fff'
          }}
          source="bounding-box"
        />
          <Layer
              id="transparent-layer"
              type="fill"
              paint={{
                  'fill-color': '#fff',
                  'fill-opacity': 0.2,
              }}
              source="transparent-layer"
          />
          <Layer
              id="trees-layer"
              type="circle"
              paint={{
                  'circle-radius': {
                      'base': 1.9,
                      'stops': [[12, 2], [22, 180]]
                  },
                  'circle-color': [
                      'interpolate',
                      ['linear'],
                      ['get', 'height'],
                      0, 'white',
                      70, 'darkgreen'
                  ],
              }}
              source="trees-layer"
          />
      </Map>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentSite: state.sites.byId[state.sites.selected],
    center: state.map.center,
    zoom: state.map.zoom,
      siteTrees: state.trees.siteTrees
  };
}

const mapDispatchToProps = {
  centerMapOnSite,
  mapSetCenter,
  mapSetZoom
};

export default connect(mapStateToProps, mapDispatchToProps)(InteractiveMap);
