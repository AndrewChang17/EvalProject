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

      const treesFeatures = turf.points(siteTrees.map(tree => [Number(tree.long), Number(tree.lat)]));

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
                  'circle-color': '#fff',
                  'circle-radius': {
                      'base': 1.75,
                      'stops': [[12, 2], [22, 180]]
                  },
              }}
              source="trees-layer"
          />
      </Map>
    );
  }
}

function mapStateToProps(state) {
    //console.log(state.trees.siteTrees);
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
